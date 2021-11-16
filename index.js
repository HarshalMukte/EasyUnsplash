let input = document.getElementById("input");
let columns = [...document.querySelectorAll(".grid .column")];
let NoDataMessage = document.querySelector("#NoDataMessage");
let grid = document.querySelector(".grid");
let upBtn = document.getElementById("upBtn")
let loadHeight = 0;

let totalPages = 1;
let page = 1;

let removeImg = () => {
  columns.map((e) => (e.innerHTML = ""));
  page = 1;
};

let loadImg = () => {
  let url;
  input.value
    ? (url = `https://api.unsplash.com/search/photos/?query=${input.value}&page=${page}&per_page=30&client_id=hE4D_DUQclCbpHM5XYw5PYuPmc7nxLN-x_Hv-_-pt0E`)
    : (url = `https://api.unsplash.com/search/photos/?query=random&page=${page}&per_page=30&client_id=hE4D_DUQclCbpHM5XYw5PYuPmc7nxLN-x_Hv-_-pt0E`);

  // input.value && !columns[0].firstElementChild ? url = `https://api.unsplash.com/search/photos/?query=${input.value}&client_id=hE4D_DUQclCbpHM5XYw5PYuPmc7nxLN-x_Hv-_-pt0E`: url = `https://api.unsplash.com/search/photos/?query=random&client_id=hE4D_DUQclCbpHM5XYw5PYuPmc7nxLN-x_Hv-_-pt0E` ;
  // let test = `https://api.unsplash.com/search/photos/?query=car&page=2&per_page=30&client_id=hE4D_DUQclCbpHM5XYw5PYuPmc7nxLN-x_Hv-_-pt0E`

  fetch(url)
    .then((response) =>
      response.ok ? response.json() : console.log("enter the correct value")
    )
    .then((data) => {
      console.log(data);
      totalPages = data.total_pages;

      if (data.total === 0 || data.total_pages === 0) {
        NoDataMessage.style.display = "flex";
      } else {
        NoDataMessage.style.display = "none";
        data.results.map((element, index) => {
          let reqHtml = `<div class="image-box" data-link="${element.links.download}">
          <img src="${element.urls.small}" alt="image"/>
          </div>`;

          index % 2 === 0
            ? columns[0].insertAdjacentHTML("beforeend", reqHtml)
            : columns[1].insertAdjacentHTML("beforeend", reqHtml);
        });
      }
    });
};

// for geting values of images after they have load and add eventlistner
let viewImg = () => {
  let imageBoxes = document.querySelectorAll(".image-box");
  let viewBox = document.querySelector(".displayImg");
  let viewBoxImg = document.querySelector(".displayImg img");
  let downloadBtn = document.querySelector(".displayImg .download");
  // console.log(imageBoxes);

  imageBoxes.forEach((e) => {
    e.addEventListener("click", () => {
      if (e.getAttribute("data-link") != viewBoxImg.src) {
        // first removing and then appling the values
        viewBoxImg.src = "";
        viewBox.style.display = "none";
        viewBox.style.display = "block";
        viewBoxImg.src = e.getAttribute("data-link");
        // seting up href value of anchar tag to target element in the other tab
        downloadBtn.href = e.getAttribute("data-link");
      }
    });
  });
};

window.addEventListener("load", () => {
  let loading = document.querySelector(".grid .loading");
  loading.style.display = "flex";

  // geting chrome data for input value
  chrome.storage.sync.get("InputVal", (data) => {
    input.value = data.InputVal;
  });

  setTimeout(() => {
    loading.style.display = "none";
    loadImg();
  }, 1500);

  setTimeout(() => {
    // for auto scroll to default left extension geting chrome data for input value
    chrome.storage.local.get("scrollHeight", (data) => {
      loadHeight = data.scrollHeight;
      console.log(loadHeight);
      grid.scrollTo({
        top: data.scrollHeight,
        behavior: "smooth",
      });
    });
  }, 2000);

  setTimeout(() => {
    viewImg();
  }, 3000);
});

input.addEventListener("keydown", (event) => {
  let val = input.value;

  if (event.key === "Enter") {
    removeImg();
    loadImg();
    // clearingdata in the chrome storage
    chrome.storage.sync.clear();
    setTimeout(() => {
      // storing data in the chrome storage
      chrome.storage.sync.set({ InputVal: val });
      viewImg();
    }, 3000);
  }
});

grid.addEventListener("scroll", (e) => {
  let scrollHeight = grid.scrollHeight - 450 + 10; //450px is grid height and 8px is bottom border

  // storing data in the chrome storage
  chrome.storage.local.set({ scrollHeight: grid.scrollTop });

  if (scrollHeight === grid.scrollTop && page < totalPages) {
    page = page + 1;
    loadImg();
    setTimeout(() => {
      viewImg();
    }, 1000);

    grid.scrollTop < loadHeight ? 
    // for setting height on load
    setTimeout(() => {
      grid.scrollTo({
        top: loadHeight,
        behavior: "smooth"
      });
    }, 1000) : false;

  } else {
    page;
  }

  // to display top btn on scrolling 
  if (grid.scrollTop > 200 ) {
    upBtn.style.display = "flex";
  } else {
    upBtn.style.display = "none";
  }
  // to go top on click topBtn
  upBtn.addEventListener("click", () => {
    grid.scrollTop = 0;
  });

});
