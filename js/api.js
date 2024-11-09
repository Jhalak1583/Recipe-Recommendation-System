"use strict";

window.ACCESS_POINT = "https://api.edamam.com/api/recipes/v2";
const /** { String } */ API_ID = "801ca179";
const /** { String } */ API_KEY = "6f9821632ba40fd6871a639080e277fe";
const /** { String } */ TYPE = "public";

export const fetchData = async function (queries, successsCallback) {
  const /** { String } */ query = queries
      ?.join("&")
      .replace(/,/g, "=")
      .replace(/ /g, "%20")
      .replace(/\+/g, "%2B");

  const /** { String } */ url = `${ACCESS_POINT}?app_id=${API_ID}&app_key=${API_KEY}&type=${TYPE}${
      query ? `&${query}` : ""
    }`;

  const /** {Object} */ response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    successsCallback(data);
  }
};
