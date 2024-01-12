// function isResumeUploadPage() {
//     const labels = document.querySelectorAll('label[for]');
//     for (const label of labels) {
//       const spanButton = label.querySelector('span[role="button"]');
//       if (spanButton && spanButton.textContent.trim() === 'Upload resume') {
//         return true; // Found the label with the specified content
//       }
//     }
//     return false; // Did not find the label with the specified content
//   }
  
//   // Example usage
//   if (isResumeUploadPage()) {
//     console.log('This is a resume upload page.');
//   } else {
//     console.log('This is not a resume upload page.');
//   }
  
  export function isSentPage(){
    var h2Element = document.querySelector('h2#post-apply-modal');
    if (h2Element) {
      var spanElement = document.querySelector('button span.artdeco-button__text');
      if (spanElement.textContent.trim() === 'Done') {
        return true;
      }
    }
    return false;
  }
  
  
    // add a function to check or uncheck radio button
    // input[data-test-text-selectable-option__input="Yes"]').checked = true;
    // function checkRadioButton(radioSelector) {
    //   var radio = document.querySelector(radioSelector);
    //   if (radio) {
    //     radio.checked = true;
    //   } else {
    //     console.log(`Radio '${radioSelector}' not found`);
    //   }
    // } 