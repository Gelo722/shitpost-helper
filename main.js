// Meme_api

const generateMemeBtn = document.querySelector(".meme-generator .generate-meme-btn");
const memeImage = document.querySelector(".meme-generator img");
const memeTitle = document.querySelector(".meme-generator .meme-title");
const memeAuthor = document.querySelector(".meme-generator .meme-author");
const memeCopy = document.querySelector(".meme-generator .copy-btn");
const memeDownload = document.querySelector('.meme-generator .download-btn')

const updateDetails = (url, title, author) => {
    memeImage.setAttribute("src", url)
    memeTitle.innerHTML = title;
    memeAuthor.innerHTML = author;
}
const generateMeme = () => {
    // Change subreddit
    fetch("https://meme-api.com/gimme/memes").then((Response) => Response.json()).then(data => {
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


// Copy Image
memeCopy.addEventListener('click', () => {
    copyToClipboard(memeImage.src);
});

memeDownload.addEventListener("click", () => {downloadImage(memeImage.src);

});