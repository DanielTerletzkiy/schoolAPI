var Http = (() => {
  // Setup request for json
  var getOptions = (verb, data) => {
    console.log(document);
    var options = {
      dataType: "json",
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie('schoolAPI')}`,
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return options;
  };
  // Set Http methods
  return {
    get: (path) => fetch(path, getOptions("GET")),
    post: (path, data) => fetch(path, getOptions("POST", data)),
    put: (path, data) => fetch(path, getOptions("PUT", data)),
    delete: (path) => fetch(path, getOptions("DELETE")),
  };
})();

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
