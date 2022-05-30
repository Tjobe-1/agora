import axios from "axios";

// axios.<method> will now provide autocomplete and parameter typings

const URL = "https://agora-baserow.herokuapp.com/api/database/";
const API_KEY = "2uSBXlWAJGjDabr7pWGX2gk63GOjznLQ";

const headers = { headers: { authorization: "Token " + API_KEY } };

async function getRows(table, filter, row) {
  try {
    const result = await axios.get(
      URL + "rows/table/" + table + row + "/?user_field_names=true&" + filter,
      headers
    );

    if (result.status == 200) {
      return result;
    } else {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
  }
}

async function getFields(table, filter) {
  try {
    const result = await axios.get(
      URL + "fields/table/" + table + "/?" + filter,
      headers
    );

    if (result.status == 200) {
      return result.data;
    } else {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
  }
}

async function processRows(table, filter, row) {
  res = await getRows(table, filter, row);
  returnData = [];

  if (!Array.isArray(res.data.results)) {
    res.data.results = [];
    res.data.results[0] = res.data;
  }

  res.data.results.forEach((element) => {
    apObj = {};
    meta = [];
    relations = [];

    Object.keys(element).forEach(function (key) {
      if (key == "Title") {
        apObj.title = element[key];
      } else if (key.includes("Meta_")) {
        meta_el = {};
        meta_el.name = key.replace("Meta_", "");
        meta_el.content = element[key];
        meta.push(meta_el);
      } else if (key == "Content_Text") {
        apObj.text = element[key];
      } else if (key == "Content_Image") {
        apObj.image = element[key];
      } else if (key.includes("Rel_")) {
        relations_el = {};
        keys = [];
        switch (key) {
          case "Rel_Phase":
            relations_el.table = 11;
            break;
          case "Rel_System":
            relations_el.table = 8;
            break;
          case "Rel_Category":
            relations_el.table = 10;
            break;
          case "Rel_Outsider":
            relations_el.table = 9;
            break;
          case "Rel_Street":
            relations_el.table = 7;
            break;
        }

        element[key].forEach((relation) => {
          keys_content = {};
          keys_content.id = relation.id;
          keys_content.title = relation.value;
          keys.push(keys_content);
        });

        relations_el.keys = keys;
        relations.push(relations_el);
      }
    });

    apObj.tableid = element.id;
    apObj.id = element.id.toString() + table.toString();
    apObj.table = table;
    apObj.meta = meta;
    apObj.relations = relations;

    returnData.push(apObj);
  });

  if (returnData.length > 1) {
    return returnData;
  } else {
    return returnData[0];
  }
}

export async function get(params) {
  //console.log(params.url.searchParams);
  let parameters = params.url.searchParams;
  let filter = parameters.get("filter");
  let type = parameters.get("type");
  let table = parameters.get("table");
  let row = parameters.get("row");
  res = "";
  let body_string ="";

  if (type == "rows") {
    res = await processRows(table, filter, "");

  } else if (type == "relations") {
    ids = [];
    for (var pair of parameters.entries()) {
      if (pair[0] == "id") {
        row_id = pair[1];
        row_str = "/" + row_id;
        ids.push(row_str);
      }
    }
    const result = await Promise.all(
      ids.map(async(id) => {
        const card = await processRows(table, filter, id);
        return card;
      })
    )
    res = result;
  } else if (type == "row") {
    id = "/" + row
    res = await processRows(table, filter, id)
  } else if (type == "filter_rows") {
    res = await processRows(table, filter, "")
  } else if (type == "fields") {
    res = await getFields(table, filter)

  }


  body_string = JSON.stringify(res);
  return {
    headers: {
      "Content-Type": "application/json",
    },
    body: body_string,
  };
}