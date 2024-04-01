const cl = console.log;
const studentForm = document.getElementById("studentForm");
const fnameControl = document.getElementById("fname");
const lnameControl = document.getElementById("lname");
const emailControl = document.getElementById("email");
const contactControl = document.getElementById("contact");
const stdContainer = document.getElementById("stdContainer");
const stdTable = document.getElementById("stdTable");
const noStdMsg = document.getElementById("noStdMsg");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");

let stdArr = [];

const generateUuid = () => {
  return String("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(
    /[xy]/g,
    (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;

      return value.toString(16);
    }
  );
};

const checkStdCount = () => {
  if (stdArr.length > 0) {
    stdTable.classList.remove("d-none");
    noStdMsg.classList.add("d-none");
  } else {
    stdTable.classList.add("d-none");
    noStdMsg.classList.remove("d-none");
  }
};

const onEdit = (ele) => {
  let editId = ele.closest("tr").id;
  localStorage.setItem("editId", editId);
  cl(editId);
  let obj = stdArr.find((std) => std.stdId === editId);
  cl(obj);
  fnameControl.value = obj.fname;
  lnameControl.value = obj.lname;
  emailControl.value = obj.email;
  contactControl.value = obj.contact; 
 
  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
};

// const onDelete = (ele) =>{
//   let getConfirm = confirm(`Are you sure, you want to delete this student's information`);
//   cl(getConfirm);
//   if(getConfirm){
//     let deleteId= ele.closest("tr").id;
//   cl(deleteId)
//   let deleteIndex = stdArr.findIndex(std => std.stdId===deleteId)
//   stdArr.splice(deleteIndex,1);
//   localStorage.setItem("stdArr",JSON.stringify(stdArr));
//   ele.closest("tr").remove();
//
// }
// else{
//   return
// }
// }

const onDelete = (ele) => {
  Swal.fire({
    title: "Do you want to remove this std?",
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      let deleteId = ele.closest("tr").id;
      cl(deleteId);
      let deleteIndex = stdArr.findIndex((std) => std.stdId === deleteId);
      stdArr.splice(deleteIndex, 1);
      localStorage.setItem("stdArr", JSON.stringify(stdArr));
      ele.closest("tr").remove();
      Swal.fire({
        title : `student is removed successfully`, 
        icon : `success`,
        timer : 2500
      })
    }
  });
};

const addStdOnUi = (obj) => {
  let tr = document.createElement("tr");
  tr.id = obj.stdId;
  tr.innerHTML = `
         <td>${1}</td>
         <td>${obj.fname}</td>
         <td>${obj.lname}</td>
         <td>${obj.email}</td>
         <td>${obj.contact}</td>
         <td><i class="fa-solid fa-pen-to-square fa-2x text-success" onClick="onEdit(this)"></i></td>
         <td><i class="fa-solid fa-trash-can fa-2x text-danger" onClick="onDelete(this)"></i></td>`;
  stdContainer.prepend(tr);

  let allTr = [...stdContainer.children];
  for (let i = 0; i < stdArr.length; i++) {
    allTr[i].firstElementChild.innerHTML = i + 1;
  }
};

const templatingOfStd = (arr) => {
  let result = ``;
  arr.forEach((obj, i) => {
    result += `
      <tr id="${obj.stdId}">
          <td>${i + 1}</td>
          <td>${obj.fname}</td>
          <td>${obj.lname}</td>
          <td>${obj.email}</td>
          <td>${obj.contact}</td>
          <td><i class="fa-solid fa-pen-to-square fa-2x text-success" onClick="onEdit(this)"></i></td>
          <td><i class="fa-solid fa-trash-can fa-2x text-danger" onClick="onDelete(this)"></i></td>

      </tr>
      `;
  });

  stdContainer.innerHTML = result;
};
if (localStorage.getItem("stdArr")) {
  stdArr = JSON.parse(localStorage.getItem("stdArr"));
  templatingOfStd(stdArr);
}
checkStdCount();

const onStdAdd = (eve) => {
  eve.preventDefault();
  let newStd = {
    fname: fnameControl.value,
    lname: lnameControl.value,
    email: emailControl.value,
    contact: contactControl.value,
    stdId: generateUuid(),
  };
  cl(newStd);
  stdArr.unshift(newStd);
  localStorage.setItem("stdArr", JSON.stringify(stdArr));
  checkStdCount();
  //templatingOfStd(stdArr);
  addStdOnUi(newStd);

  eve.target.reset(); //eve.target means that document object on which we have binded our event

  Swal.fire({
    title: `${newStd.fname} ${newStd.lname} is added as a new student successfully !!!`,
    icon: `success`,
    timer: 2000,
  });
};

const onUpdateBtnClick = () => {
  let updateId = localStorage.getItem("editId");
  let updatedObj = {
    fname: fnameControl.value,
    lname: lnameControl.value,
    email: emailControl.value,
    contact: contactControl.value,
    stdId: updateId,
  };
  cl(updatedObj);
  let getIndex = stdArr.findIndex((obj) => obj.stdId === updateId);
  cl(getIndex);
  stdArr[getIndex] = updatedObj;
  localStorage.setItem("stdArr", JSON.stringify(stdArr));
  let updatingTr = document.getElementById(updateId);
  cl(updatingTr);
  let childEle = [...updatingTr.children];
  childEle[1].innerHTML = updatedObj.fname;
  childEle[2].innerHTML = updatedObj.lname;
  childEle[3].innerHTML = updatedObj.email;
  childEle[4].innerHTML = updatedObj.contact;
  studentForm.reset();

  addBtn.classList.remove("d-none");
  updateBtn.classList.add("d-none");

  Swal.fire({
    title: `${updatedObj.fname} ${updatedObj.lname}'s information is updated !`,
    icon: "success",
    timer: 2500,
  });
};

studentForm.addEventListener("submit", onStdAdd);
updateBtn.addEventListener("click", onUpdateBtnClick);
