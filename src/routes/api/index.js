import axios from "axios";

// axios.<method> will now provide autocomplete and parameter typings

const API_KEY = "2uSBXlWAJGjDabr7pWGX2gk63GOjznLQ";

const headers = { headers: { authorization: "Token " + API_KEY } };

async function getFields(table) {
  try {
    const result = await axios.get(
      "https://agora-baserow.herokuapp.com/api/database/fields/table/" + table,
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
  result = await axios.get(
    "https://agora-baserow.herokuapp.com/api/database/fields/table/" + table,
    headers
  );

  return result;
}

async function getRows(table) {
  try {
    const result = await axios.get(
      "https://agora-baserow.herokuapp.com/api/database/rows/table/" +
        table +
        "/?user_field_names=true",
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

async function processRaw() {
  res = await getRows(3);
  returnData = [];

  res.data.results.forEach((element) => {
    apObj = {};

    apObj.id = element.id;

    apObj.image = "";
    apObj.meta = [];
    apObj.links = [];
    apObj.content = element.Content;
    apObj.title = element.Name;
    apObj.image = element.Image;

    if(element.Participant != null) {

    apObj.meta.push("P: " + element.Participant);
    }


      



    if (element.Analysis.length > 0) {
      element.Analysis.forEach((link) => {
        apObj.links.push(link.value);
      });
    }

    if(apObj.title != "") {

    returnData.push(apObj);
    }
  });

  return returnData;
}

export async function get() {
  res = await processRaw();

  return {
    body: res,
  };
}
