import axios from "axios";

// axios.<method> will now provide autocomplete and parameter typings

const URL = "https://agora-baserow.herokuapp.com/api/database/";
const API_KEY = "2uSBXlWAJGjDabr7pWGX2gk63GOjznLQ";


const headers = { headers: { authorization: "Token " + API_KEY } };

async function getRows(table, filter) {
  try {
    const result = await axios.get(
      URL+ "rows/table/" +
        table +
        "/?user_field_names=true&" +
        filter,
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
      URL+ "fields/table/" +
        table +
        "/?" +
        filter,
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


async function processRows(table, filter) {
  res = await getRows(table, filter);
  returnData = [];

  res.data.results.forEach((element) => {
    apObj = {};
    meta = [];
    relations = [];

    Object.keys(element).forEach(function (key) {
      if (key == "Title") {
        apObj.title = element[key];
      } else if (key.includes("Meta_")) {
        meta_el = {};
        meta_el.name = key.replace('Meta_', '');
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

    apObj.id = element.id;
    apObj.meta = meta;
    apObj.relation = relations;


    returnData.push(apObj);
  });

  return returnData;
}

export async function get() {
  res = await processRows(7, "");

  return {
    body: res,
  };
}
