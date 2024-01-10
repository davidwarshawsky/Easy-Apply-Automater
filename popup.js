document.getElementById('clickButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: clickButtonOnPage
    });
  });
});

function clickButtonOnPage() {
  function clickAndWait(buttonSelector, delay) {
    return new Promise((resolve) => {
      var button = document.querySelector(buttonSelector);
      if (button) {
        button.click();
        setTimeout(resolve, delay);
      } else {
        console.log(`Button '${buttonSelector}' not found`);
        resolve(); // Resolve even if the button is not found
      }
    });
  }

  function uncheckCheckbox(checkboxSelector) {
    var checkbox = document.querySelector(checkboxSelector);
    if (checkbox) {
      checkbox.checked = false;
    } else {
      console.log(`Checkbox '${checkboxSelector}' not found`);
    }
  }

  clickAndWait('.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', 0)
    .then(() => clickAndWait('button[aria-label="Continue to next step"]', 2000))
    .then(() => clickAndWait('button[aria-label="Continue to next step"]', 2000))
    .then(() => clickAndWait('button[aria-label="Review your application"]', 2000))
    .then(() => uncheckCheckbox('#follow-company-checkbox'))
    .then(() => clickAndWait('button[aria-label="Submit application"]', 2000))
    .catch((error) => {
      console.error('Error:', error);
    });
}


function isResumeUploadPage() {
  const labels = document.querySelectorAll('label[for]');
  for (const label of labels) {
    const spanButton = label.querySelector('span[role="button"]');
    if (spanButton && spanButton.textContent.trim() === 'Upload resume') {
      return true; // Found the label with the specified content
    }
  }
  return false; // Did not find the label with the specified content
}

// Example usage
if (isResumeUploadPage()) {
  console.log('This is a resume upload page.');
} else {
  console.log('This is not a resume upload page.');
}