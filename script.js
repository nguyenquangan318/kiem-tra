let today = new Date();
let data = [];
function generateDOM(data) {
  $(".table").html(`<tr>
  <th>id</th>
  <th>name</th>
  <th>date</th>
  <th>quantity</th>
  <th>action
  </th>
</tr> `);
  for (let i in data) {
    let tr = $(`<tr>
    <td style = "background-color:${data[i].color}">${data[i].id}</td>
    <td style = "background-color:${data[i].color}">${data[i].name}</td>
    <td style = "background-color:${data[i].color}">${data[i].date}</td>
    <td style = "background-color:${data[i].color}">${data[i].quantity}</td>
    <td style = "background-color:${data[i].color};width:220px">
    <button class="update-btn btn btn-success mr-2">Update</button>
    <button class="del-btn btn btn btn-danger ">Delete</button>
    </td>
    </tr>`);
    $(".table").append(tr);
  }
}

function saveToLocal(data) {
  localStorage.setItem("products", JSON.stringify(data));
}

function checkEmpty(data) {
  if (data.length == 0) {
    document.querySelector(".msg").innerText = "There is no Data";
  } else {
    document.querySelector(".msg").innerText = "";
  }
}

function validateData(id, name, date, quantity, filterData) {
  if (id === "" || name === "" || date === "" || quantity === "") {
    alert("data must not be blank");
    return false;
  }
  if (name.length < 6) {
    alert("name must have length bigger than 6");
    return false;
  }
  if (quantity < 0) {
    alert("quantity must be bigger than 0");
    return false;
  }
  for (let i in filterData) {
    if (filterData[i].id === id) {
      alert("id must be unique");
      return false;
    }
  }
  return true;
}

$(".search-btn").on("click", function () {
  let searchName = $(".search-input").val().toLowerCase();
  let searchedList = [];
  for (let i in data) {
    if (data[i].name.toLowerCase().includes(searchName)) {
      searchedList.push(data[i]);
    }
  }
  checkEmpty(searchedList);
  generateDOM(searchedList);
});

function loadData() {
  data = JSON.parse(localStorage.getItem("products")) || [];
  localStorage.setItem("products", JSON.stringify(data));
  checkEmpty(data);
  generateDOM(data);
}
loadData();

$(".add-btn").on("click", function () {
  let id = $(".id").val();
  let name = $(".name").val();
  let date = $(".date").val();
  let quantity = $(".quantity").val();
  let addedProduct = {
    id: Number(id),
    name: name.trim(),
    date: date,
    quantity: quantity,
    color: "",
  };
  let check = validateData(id, name, date, quantity, data);
  if (check) {
    data.push(addedProduct);
    saveToLocal(data);
    generateDOM(data);
    checkEmpty(data);
    $(".id").val("");
    $(".name").val("");
    $(".date").val("");
    $(".quantity").val("");
  }
});

$(".sort-by-date").on("click", function () {
  data.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  generateDOM(data);
});

$(".sort-by-name").on("click", function () {
  data.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  generateDOM(data);
});

$(".quantity-color").on("click", function () {
  for (let i in data) {
    data[i].color = "";
    if (data[i].quantity == 0) {
      data[i].color = "red";
    }
    if (data[i].quantity != 0) {
      data[i].color = "green";
    }
  }
  generateDOM(data);
});

$(".date-color").on("click", function () {
  for (let i in data) {
    data[i].color = "";
    diffTime = Math.abs(new Date(data[i].date) - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      data[i].color = "orange";
    }
  }
  generateDOM(data);
});

$(".filter-finished ").on("click", function () {
  let filteredData = data.filter((data) => {
    return new Date(data.date) < today;
  });
  checkEmpty(filteredData);
  generateDOM(filteredData);
});
$(".filter-unfinished ").on("click", function () {
  let filtereddata = data.filter((data) => {
    return new Date(data.date) >= today;
  });
  checkEmpty(filtereddata);
  generateDOM(filtereddata);
});

$(".show-all").on("click", function () {
  checkEmpty(data);
  for (let i in data) {
    data[i].color = "";
  }
  generateDOM(data);
});

$(document).on("click", ".update-btn", function () {
  let updateId = parseInt($("td:first", $(this).parents("tr")).text());
  let checkId = true;
  let checkedData = data.filter((data) => {
    return data.id != updateId;
  });
  let oldProduct = data.find((product) => product.id == updateId);
  $(".oldId").text(`${oldProduct.id}`);
  $(".oldName").text(`${oldProduct.name}`);
  $(".oldDate").text(`${oldProduct.date}`);
  $(".oldQuantity").text(`${oldProduct.quantity}`);
  $(".updateModal").css("display", "block");
  $(".close2").on("click", () => {
    $(".updateModal").css("display", "none");
  });
  $(".confirm-update").unbind("click");
  $(".confirm-update").on("click", () => {
    let newId = parseInt($(".newId").val());
    let newName = $(".newName").val();
    let newDate = $(".newDate").val();
    let newQuantity = $(".newQuantity").val();
    let check = validateData(newId, newName, newDate, newQuantity, checkedData);
    if (check) {
      oldProduct.id = newId;
      oldProduct.name = newName;
      oldProduct.date = newDate;
      oldProduct.quantity = newQuantity;
      oldProduct.color = "";
      checkEmpty(data);
      generateDOM(data);
      $(".updateModal").css("display", "none");
    }
  });
});

$(document).on("click", ".del-btn", function () {
  let delId = $("td:first", $(this).parents("tr")).text();
  $(".delModal").css("display", "block");
  $(".close1").on("click", () => {
    $(".delModal").css("display", "none");
  });
  $(".confirm-del").unbind("click");
  $(".confirm-del").on("click", () => {
    for (let i in data) {
      if (data[i].id == delId) {
        data.splice(i, 1);
      }
    }
    saveToLocal(data);
    checkEmpty(data);
    generateDOM(data);
    $(".delModal").css("display", "none");
  });
});
