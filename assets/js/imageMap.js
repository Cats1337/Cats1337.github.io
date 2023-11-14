// Fetch the language data from the JSON file
async function fetchLanguages() {
  try {
    const response = await fetch('assets/json/languages.json');

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

// Function to display languages with corresponding images
function displayLanguages(categories) {
  const imageMapsContainer = document.getElementById('imageMaps');

  // Helper function to transform code names
  function transformCodeName(codeName) {
    return codeName.toLowerCase().replace(/\*/g, '').replace(/#/g, 'sharp').replace(/\+/g, 'p');
  }

  // Iterate over each category in the JSON file
  for (const category in categories) {
    if (categories.hasOwnProperty(category)) {
      const languages = categories[category];

      // Create a div for each category
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('category');

      // Create a heading for the category
      const categoryHeading = document.createElement('h2');
      categoryHeading.textContent = category + " Languages";
      if (category === 'Tools') {
        categoryHeading.textContent = category;
      }

      // Append the heading to the category div
      categoryDiv.appendChild(categoryHeading);

      // Iterate over each language in the category
      for (let i = 0; i < languages.length; i += 4) {
        // Create a container div for languages using flexbox
        const languagesContainer = document.createElement('div');
        languagesContainer.classList.add('languages-container');

        // Iterate over each language in the current batch of four
        for (let j = i; j < i + 4 && j < languages.length; j++) {
          // Create a div for each language
          const languageDiv = document.createElement('div');
          languageDiv.classList.add('language');

          // Get the transformed image file name for the language
          const transformedCodeName = transformCodeName(languages[j]);
          const imageFileName = `${transformedCodeName}.svg`;

          // Create an image element
          const image = document.createElement('img');
          image.src = `assets/images/${imageFileName}`;
          image.alt = languages[j];

          // Append the image to the language div
          languageDiv.appendChild(image);

          // Create a paragraph element for the language name
          const p = document.createElement('p');
          p.innerText = languages[j];

          // Append the paragraph to the language div
          languageDiv.appendChild(p);

          // Append the language div to the languages container
          languagesContainer.appendChild(languageDiv);
        }

        // Add a style to center the languages when there are fewer than four
        const numberOfLanguages = languages.length - i;
        if (numberOfLanguages < 4) {
          languagesContainer.style.justifyContent = 'center';
          languagesContainer.style.display = 'flex';
        }

        // Append the languages container to the category div
        categoryDiv.appendChild(languagesContainer);
      }

      // Append the category div to the imageMaps container
      imageMapsContainer.appendChild(categoryDiv);
    }
  }
}

// Call the function to fetch and display languages
fetchLanguages();

