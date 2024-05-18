// Fetch the language data from the YAML file
async function fetchLanguages() {
  try {
    const response = await fetch('portfolioAssets/files/languages.yml');

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }

    const yamlText = await response.text();
    const categories = jsyaml.load(yamlText);

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
function createParagraph(text, className = '') {
  const p = document.createElement('p');
  p.innerText = text;
  if (className) {
    p.classList.add(className);
  }
  return p;
}

// Function to calculate the time since a given year
function calculateTimeSince(year) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
  const languageStartYear = parseInt(year);
  const languageStartMonth = 1; // Assuming the language was started in January

  let yearsSince = currentYear - languageStartYear;
  let monthsSince = currentMonth - languageStartMonth;

  if (monthsSince < 0) {
    yearsSince -= 1;
    monthsSince += 12;
  }

  if (yearsSince > 1) {
    return `${yearsSince} years`;
  } else if (yearsSince === 1) {
    return '1 year';
  } else {
    return `${monthsSince} month${monthsSince !== 1 ? 's' : ''}`;
  }
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
      const languageEntries = Object.entries(languages);
      for (let i = 0; i < languageEntries.length; i += 4) {
        const languagesContainer = document.createElement('div');
        languagesContainer.classList.add('languages-container');

        for (let j = i; j < i + 4 && j < languageEntries.length; j++) {
          const [language, year] = languageEntries[j];
          const languageDiv = document.createElement('div');
          languageDiv.classList.add('language');

          // Transform the code name to match the image file name
          const transformedCodeName = transformCodeName(language);

          // If the language is not in the devicon library, use custom image
          if (transformedCodeName === 'cobol') {
            const image = createImage(`portfolioAssets/images/${transformedCodeName}.svg`, language);
            languageDiv.appendChild(image);
            languageDiv.appendChild(createParagraph(language));
            languageDiv.appendChild(createParagraph(calculateTimeSince(year), 'years-grey'));
            languagesContainer.appendChild(languageDiv);
            continue;
          }

          // If the language is MySQL, use the wordmark image
          if (transformedCodeName === 'mysql') {
            const imageFolderName = `${transformedCodeName}`;
            const imageFileName = `${transformedCodeName}-original-wordmark.svg`;
            const image = createImage(`https://raw.githubusercontent.com/devicons/devicon/master/icons/${imageFolderName}/${imageFileName}`, language);
            languageDiv.appendChild(image);
            languageDiv.appendChild(createParagraph(language));
            languageDiv.appendChild(createParagraph(calculateTimeSince(year), 'years-grey'));
            languagesContainer.appendChild(languageDiv);
            continue;
          }

          // Get the image from the devicon library
          const imageFolderName = `${transformedCodeName}`;
          const imageFileName = `${transformedCodeName}-original.svg`;

          // Create the image element and append it to the language div
          const image = createImage(`https://raw.githubusercontent.com/devicons/devicon/master/icons/${imageFolderName}/${imageFileName}`, language);
          languageDiv.appendChild(image);
          languageDiv.appendChild(createParagraph(language));
          languageDiv.appendChild(createParagraph(calculateTimeSince(year), 'years-grey'));
          languagesContainer.appendChild(languageDiv);
        }

        const numberOfLanguages = languageEntries.length - i;
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
