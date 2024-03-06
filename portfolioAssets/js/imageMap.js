// Fetch the language data from the JSON file
async function fetchLanguages() {
  try {
    const response = await fetch('portfolioAssets/json/languages.json');

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const categories = await response.json();

    // Display the languages with corresponding images
    displayLanguages(categories);
  } catch (error) {
    console.error('Error fetching languages:', error);
  }
}

// Function to transform code names
function transformCodeName(codeName) {
  return codeName.toLowerCase().replace(/[\*\+#]/g, (match) => {
    if (match === '*') return '';
    if (match === '#') return 'sharp';
    if (match === '+') return 'plus';
  });
}

// Function to create an image element
function createImage(src, alt) {
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  return image;
}

// Function to create a paragraph element
function createParagraph(text) {
  const p = document.createElement('p');
  p.innerText = text;
  return p;
}

// Function to display languages with corresponding images
function displayLanguages(categories) {
  const imageMapsContainer = document.getElementById('imageMaps');

  for (const category in categories) {
    if (categories.hasOwnProperty(category)) {
      const languages = categories[category];

      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');

      const categoryHeading = document.createElement('h2');
      categoryHeading.textContent = category === 'Tools' ? category : category + " Languages";

      categoryDiv.appendChild(categoryHeading);

      // Display the languages in groups of 4
      for (let i = 0; i < languages.length; i += 4) {
        const languagesContainer = document.createElement('div');
        languagesContainer.classList.add('languages-container');

        for (let j = i; j < i + 4 && j < languages.length; j++) {
          const languageDiv = document.createElement('div');
          languageDiv.classList.add('language');

          // Transform the code name to match the image file name
          const transformedCodeName = transformCodeName(languages[j]);

          // If the language is not in the devicon library, use custom image
          if (transformedCodeName === 'cobol') {
            const image = createImage(`portfolioAssets/images/${transformedCodeName}.svg`, languages[j]);
            languageDiv.appendChild(image);
            languageDiv.appendChild(createParagraph(languages[j]));
            languagesContainer.appendChild(languageDiv);
            continue;
          }

          // If the language is MySQL, use the wordmark image
          if (transformedCodeName === 'mysql') {
            const imageFolderName = `${transformedCodeName}`;
            const imageFileName = `${transformedCodeName}-original-wordmark.svg`;
            const image = createImage(`https://raw.githubusercontent.com/devicons/devicon/master/icons/${imageFolderName}/${imageFileName}`, languages[j]);
            languageDiv.appendChild(image);
            languageDiv.appendChild(createParagraph(languages[j]));
            languagesContainer.appendChild(languageDiv);
            continue;
          }

          // get the image from the devicon library
          const imageFolderName = `${transformedCodeName}`;
          const imageFileName = `${transformedCodeName}-original.svg`;

          // Create the image element and append it to the language div
          const image = createImage(`https://raw.githubusercontent.com/devicons/devicon/master/icons/${imageFolderName}/${imageFileName}`, languages[j]);
          languageDiv.appendChild(image);
          languageDiv.appendChild(createParagraph(languages[j]));
          languagesContainer.appendChild(languageDiv);
        }

        const numberOfLanguages = languages.length - i;
        if (numberOfLanguages < 4) {
          languagesContainer.style.justifyContent = 'center';
          languagesContainer.style.display = 'flex';
        }

        categoryDiv.appendChild(languagesContainer);
      }

      imageMapsContainer.appendChild(categoryDiv);
    }
  }
}

// Call the function to fetch and display languages
fetchLanguages();
