const getAccounts = async () => {
    try {
      return (await fetch("api/accounts/")).json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const showAccounts = async () => {
    let accounts = await getAccounts();
    let accountsDiv = document.getElementById("account-list");
    accountsDiv.innerHTML = "";
    accounts.forEach((account) => {
      const section = document.createElement("section");
      section.classList.add("account");
      accountsDiv.append(section);
  
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);

      const img = document.createElement("img");
      img.src = account.img;
      a.append(img);
  
      const h3 = document.createElement("h3");
      h3.innerHTML = account.name;
      a.append(h3);

      const h4 = document.createElement("h4");
      h4.innerHTML = account.nameLast;
      a.append(h4);

      const h5 = document.createElement("h5");
      h5.innerHTML = account.username;
      a.append(h5);

      const h6 = document.createElement("h6");
      h6.innerHTML = account.password;
      a.append(h6);

      const h7 = document.createElement("h7");
      h7.innerHTML = account.school;
      a.append(h7);

      const ul = document.createElement("ul");
      a.append(ul);
      console.log(account.useages);
      account.useages.forEach((useage) => {
      const li = document.createElement("li");
      ul.append(li);
      li.innerHTML = useage;
      });
  
      a.onclick = (e) => {
        e.preventDefault();
        displayDetails(account);
      };
    });
  };
  
  const displayDetails = (account) => {
    openDialog("account-details");
    const accountDetails = document.getElementById("account-details");
    accountDetails.innerHTML = "";
    accountDetails.classList.remove("hidden");

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#9249;";
    accountDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    accountDetails.append(eLink);
    eLink.id = "edit-link";
  
    const h3 = document.createElement("h3");
    h3.innerHTML = account.name;
    accountDetails.append(h3);

    const h4 = document.createElement("h4");
    h4.innerHTML = account.nameLast;
    accountDetails.append(h4);

    const p = document.createElement("p");
    accountDetails.append(p);
    p.innerHTML = account.username;

    const h5 = document.createElement("h5");
    h5.innerHTML = account.password;
    accountDetails.append(h5);

    const h6 = document.createElement("h6");
    h6.innerHTML = account.school;
    accountDetails.append(h6);
  
    const ul = document.createElement("ul");
    accountDetails.append(ul);
    console.log(account.useages);
    account.useages.forEach((useage) => {
      const li = document.createElement("li");
      ul.append(li);
      li.innerHTML = useage;
    });
  
    const spoon = document.createElement("section");
    spoon.classList.add("spoon");
    accountDetails.append(spoon);
  
    eLink.onclick = showAccountForm;
    dLink.onclick = deleteAccount.bind(this, account);
  
    populateEditForm(account);
  };
  
  const populateEditForm = (account)=>{
    const form = document.getElementById("account-form");
    form._id.value = account._id;
    form.name.value = account.name;
    form.nameLast.value = account.nameLast;
    form.username.value = account.username;
    form.password.value = account.password;
    document.getElementById("img-prev").src = account.img;
    populateUseages(account.useages);
  };
  
  const populateUseages = (useages)=>{
    const section = document.getElementById("useage-boxes");
    useages.forEach((useage)=>{
      const input = document.createElement("input");
      input.type = "text";
      input.value = useage;
      section.append(input);
    });
  };
  
  const addEditAccount = async (e) => {
    e.preventDefault();
    const form = document.getElementById("account-form");
    const formData = new FormData(form);
    let response;
    formData.append("useages", getUseages());
  
    console.log(...formData);
  
    if (form._id.value.trim() == "") {
      console.log("in post");
      response = await fetch("/api/accounts", {
        method: "POST",
        body: formData,
      });
    } else {
      console.log("in put");
      response = await fetch(`/api/accounts/${form._id.value}`,{
        method:"PUT",
        body:formData
      });
    }
  
    if (response.status != 200) {
      console.log("Error adding / editing data");
    }
  
    await response.json();
    resetForm();
    document.getElementById("dialog").style.display = "none";
    showAccounts();
  };
  
  const getUseages = () => {
    const inputs = document.querySelectorAll("#useage-boxes input");
    let useages = [];
  
    inputs.forEach((input) => {
      useages.push(input.value);
    });
  
    return useages;
  };
  
  const resetForm = () => {
    const form = document.getElementById("account-form");
    form.reset();
    form._id.value = "";
    document.getElementById("useage-boxes").innerHTML = "";
    document.getElementById("img-prev").src = "";
  };
  
  const showAccountForm = (e) => {
    openDialog("account-form");
    console.log(e.target);
    if (e.target.getAttribute("id") != "edit-link") {
      resetForm();
    }
  };
  
  const deleteAccount = async(account) =>{
    let response = await fetch(`/api/accounts/${account._id}`,{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json;charset=utf-8",
      },
    });
  
    if(response.status!= 200){
      console.log("Error deleting");
      return;
    }
  
    let result = await response.json();
    resetForm();
    showAccounts();
    document.getElementById("dialog").style.display = "none";
  };
  
  const addUseage = (e) => {
    e.preventDefault();
    const section = document.getElementById("useage-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
  };
  
  const openDialog = (id) => {
    document.getElementById("dialog").style.display = "block";
    document.querySelectorAll("#dialog-details > *").forEach((item) => {
      item.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
  };
  
  showAccounts();
  document.getElementById("account-form").onsubmit = addEditAccount;
  document.getElementById("add-link").onclick = showAccountForm;
  document.getElementById("add-useage").onclick = addUseage;
  
  document.getElementById("img").onchange = (e) => {
    if (!e.target.files.length) {
      document.getElementById("img-prev").src = "";
      return;
    }
    document.getElementById("img-prev").src = URL.createObjectURL(
      e.target.files.item(0)
    );
  };
