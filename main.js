// Meme_api

const generateMemeBtn = document.querySelector(".meme-generator .generate-meme-btn");
const memeImage = document.querySelector(".meme-generator img");
const memeTitle = document.querySelector(".meme-generator .meme-title");
const memeAuthor = document.querySelector(".meme-generator .meme-author");
const memeCopy = document.querySelector(".meme-generator .copy-btn");
const memeDownload = document.querySelector('.meme-generator .download-btn');

const urlInput = document.querySelector(".meme-generator .change-url");
const apiUrl = 'https://meme-api.com/gimme/';
let subReddit = '';

// add an event listener to the input field
urlInput.addEventListener('input', () => {
  const inputValue = urlInput.value.trim(); // get input value
  if (inputValue.length > 0) {
    subReddit = apiUrl + inputValue; // update subReddit with the new input value
    console.log(`Resulting URL: ${subReddit}`);
  } else {
    console.error("Input value is empty");
  }
});


// prevent sending the form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    });
  });

const updateDetails = (url, title, author) => {
    memeImage.setAttribute("src", url)
    memeTitle.innerHTML = title;
    memeAuthor.innerHTML = author;
}

// Get pic
const generateMeme = () => {
    // Change subreddit
    // fetch("https://meme-api.com/gimme/memes").then((Response) => Response.json()).then(data => {
    //     updateDetails(data.url, data.title, data.author)
    // });




    fetch(subReddit).then((Response) => Response.json()).then(data => {
        updateDetails(data.url, data.title, data.author)
    });

};



// make canvas to copy png
function writeToCanvas(src) {
    return new Promise((res) => {
        const canvas = document.createElement('canvas');
        const ctx  = canvas.getContext('2d');
        const img = new Image();
        img.src = src;
        img.setAttribute('crossorigin', 'anonymous');
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0,0);
            canvas.toBlob((blob) => {
                res(blob);
            }, 'image/png');
        }
    })
}

// Copy Image
async function copyToClipboard(src) {

    const blob = await writeToCanvas(src);

    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob,
            })
        ])
        console.log('Success');
    } catch(e) {
        console.log(e)
    }

};

// Download image
async function downloadImage(src) {
    const image = await fetch(src)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
  
    const link = document.createElement("a")
    link.href = imageURL
    link.download = 'image file name here'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }




generateMemeBtn.addEventListener("click", generateMeme);



memeCopy.addEventListener('click', () => {
    copyToClipboard(memeImage.src);
});


memeDownload.addEventListener("click", () => {downloadImage(memeImage.src);

});