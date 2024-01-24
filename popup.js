document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('clickButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: clickButtonOnPage
      });
    });
  });
});

function clickButtonOnPage() {
  function clickAndWait(buttonSelector, delay) {
    return new Promise((resolve,reject) => {
      // printRadioButtonQuestions();
      var button = document.querySelector(buttonSelector);
      if (button) {
        button.click();
        setTimeout(resolve, delay);
      } else {
        console.log(`Button '${buttonSelector}' not found`);
        reject(new Error(`Button '${buttonSelector}' not found`)); // Reject the promise if the button is not found}
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

  function printRadioButtonQuestions() {
    // Get all <fieldset> elements on the page
    var fieldsetElements = document.querySelectorAll('fieldset');

    // Iterate through each <fieldset>
    fieldsetElements.forEach(function(fieldset) {
      // Find the <legend> element within the current <fieldset>
      var legendElement = fieldset.querySelector('legend');

      // If <legend> exists, find the first <span> with aria-hidden="true"
      if (legendElement) {
        var firstSpanWithAriaHidden = legendElement.querySelector('span[aria-hidden="true"]');

        // If the span is found, get its text content
        if (firstSpanWithAriaHidden) {
          var textContent = firstSpanWithAriaHidden.textContent.trim();

          // Display the result for the current fieldset
          console.log('Fieldset:', textContent);

          // Find all the input elements within the current fieldset
          var inputElements = fieldset.querySelectorAll('input[data-test-text-selectable-option__input]');
          
          // Check if any input is selected
          var isAnyInputSelected = false;
          inputElements.forEach(function(input) {
            // console.log(input.getAttribute('data-test-text-selectable-option__input'));
            if (input.checked) {
              isAnyInputSelected = true;
            }
          });

          // If none of the inputs are selected, press the one with the attribute "i don't wish to answer"
          if (!isAnyInputSelected) {
            inputElements.forEach(function(input) {
              var inputText = input.getAttribute('data-test-text-selectable-option__input');
              if (inputText.toLowerCase() === "i don't wish to answer") {
                input.click();
              }
            });
          }
        }
      }
    });
  }



  function getFormPageName() {
    return new Promise((resolve, reject) => {
      // Find the first <div> with class "ph5"
      var ph5Element = document.querySelector('div.ph5:not([class*=" "])');
  
      // If <div> with class "ph5" exists, find the first <div> with class "pb4" inside it
      if (ph5Element) {
        console.log("GOT to ph5");
        var pb4Element = ph5Element.querySelector('div.pb4:not([class*=" "])');
  
        // If <div> with class "pb4" exists, find the first <h3> with class "t-16 t-bold" inside it
        if (pb4Element) {
          console.log("GOT to pb4");
          var h3Element = pb4Element.querySelector('h3.t-16.t-bold');
  
          // If <h3> with class "t-16 t-bold" exists, get its text content
          if (h3Element) {
            console.log("GOT to h3");
            var textContent = h3Element.textContent.trim();
  
            // Display the result
            console.log('Form Page Name:', textContent);
            resolve(textContent); // Resolve the promise with the value
          } else {
            console.log('Structure not found: h3');
            reject('Structure not found: h3');
          }
        } else {
          console.log('Structure not found: pb4');
          reject('Structure not found: pb4');
        }
      } else {
        console.log('Structure not found: ph5');
        reject('Structure not found: ph5');
      }
    });
  }

  function exitJob() {
    let attempts = 0;
    const maxAttempts = 16;
  
    const intervalId = setInterval(() => {
      if (document.querySelector('h2#post-apply-modal')) {
        const buttons = document.querySelectorAll('button span.artdeco-button__text');
        const doneButton = Array.from(buttons).find(button => button.textContent.trim() === 'Done');
        if (doneButton) {
          doneButton.click();
          clearInterval(intervalId); // Stop checking once the button is found and clicked
        } else {
          const dismissButton = document.querySelector('button.artdeco-modal__dismiss');
          if (dismissButton) {
            dismissButton.click();
            clearInterval(intervalId); // Stop checking once the button is found and clicked
          }
        }
      }
  
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(intervalId); // Stop checking after 16 unsuccessful attempts
      }
    }, 500); // Check every 500 milliseconds
  }



  function removeAppliedJobs() {
    var jobsList = document.querySelector('div.jobs-search-results-list');
    if (jobsList) {
      var jobCards = jobsList.querySelectorAll('div.job-card-container--clickable');
      if (jobCards) {
        jobCards.forEach(function(jobCard) {
          var jobCardStatus = jobCard.querySelector('ul.job-card-list__footer-wrapper li.job-card-container__footer-job-state');
          if (jobCardStatus) {
            var jobCardStatusText = jobCardStatus.textContent.trim();
            if (jobCardStatusText === 'Applied') {
              jobCard.remove();
            }
          }
        });
      }
    }
  }

  function removeDismissedJobs() {
    var jobsList = document.querySelector('div.jobs-search-results-list');
    if (jobsList) {
      var dismissedJobCards = jobsList.querySelectorAll('div.job-card-container--clickable.job-card-list--is-dismissed');
      if (dismissedJobCards) {
        dismissedJobCards.forEach(function(jobCard) {
          jobCard.remove();
        });
      }
    }
  }

  function dismissJobsApplied(){
    var jobsList = document.querySelector('div.jobs-search-results-list');
    if (jobsList) {
      var jobCards = jobsList.querySelectorAll('div.job-card-container--clickable');
      if (jobCards) {
        jobCards.forEach(function(jobCard) {
          var jobCardStatus = jobCard.querySelector('ul.job-card-list__footer-wrapper li.job-card-container__footer-job-state');
          if (jobCardStatus) {
            var jobCardStatusText = jobCardStatus.textContent.trim();
            if (jobCardStatusText === 'Applied') {
              var dismissButton = jobCard.querySelector('button[aria-label="Dismiss job"]');
              if (dismissButton) {
                dismissButton.click();
              }
            }
          }
        });
      }
    }
  }

  function extractQuestions() {
    var questionDivs = document.querySelectorAll('div.jobs-easy-apply-form-section__grouping');
    // div.fb-dash-form-element[data-test-form-element] label[for^="single-typeahead-entity-form-component"]
//     <div id="single-typeahead-entity-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3788477971-9054483911573926553-city-HOME-CITY-ta" class="search-basic-typeahead search-vertical-typeahead">
// <!---->        
    
//     <input id="single-typeahead-entity-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3788477971-9054483911573926553-city-HOME-CITY" required="" role="combobox" aria-autocomplete="list" aria-activedescendant="" aria-expanded="false" type="text" aria-describedby="single-typeahead-entity-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3788477971-9054483911573926553-city-HOME-CITY-error">
  
// <!---->  
//     </div>
    questionDivs.forEach(function (questionDiv) {
      // handles text input questions
      var textInputElement = questionDiv.querySelector('div.fb-dash-form-element[data-test-form-element] label[for^="single-line-text-form-component"]');
      if (textInputElement) {
        var labelText = textInputElement.textContent.trim();
        console.log('Text Input Question:', labelText);
        var inputBox = questionDiv.querySelector('input.artdeco-text-input--input');
        if (inputBox) {
          var inputValue = inputBox.value;
          if (inputValue === '' || inputValue === null) {
            var newInputValue = prompt('Please enter a value:\n' + labelText);
            inputBox.value = parseInt(newInputValue, 10);
            // Trigger input event to simulate user input
            var inputEvent = new Event('input', { bubbles: true });
            inputBox.dispatchEvent(inputEvent);
          }
          }
          console.log('Current Value:', inputBox.value);
      }
      // handles radio questions
      var fieldset = questionDiv.querySelector('fieldset');
      if (fieldset) {
        var legendElement = fieldset.querySelector('legend span[aria-hidden="true"]');
        if (legendElement) {
          var textContent = legendElement.textContent.trim();
          console.log('Radio Question:', textContent);
          var inputElements = fieldset.querySelectorAll('input[data-test-text-selectable-option__input]');
          var isAnyInputSelected = false;
          inputElements.forEach(function (input) {
            console.log(textContent + "\noption: ", input.getAttribute('data-test-text-selectable-option__input'));
            if (input.checked) {
              isAnyInputSelected = true;
            }
          });
  
          if (!isAnyInputSelected) {
            var options = [];
            inputElements.forEach(function (input) {
              options.push(input.getAttribute('data-test-text-selectable-option__input'));
            });
            // Create popup.html with question and options
            var popupHTML = `
              <h3>${textContent}</h3>
              <ul>
                ${options.map(option => `
                  <li>
                    <div style="border: 1px solid black; padding: 5px; margin-bottom: 5px;">
                      <label>
                        <input type="radio" name="${textContent}" value="${option}" />
                        ${option}
                      </label>
                    </div>
                  </li>
                `).join('')}
              </ul>
            `;
            // Open the popup.html in a new window
            var popupWindow = window.open('', '', 'width=400,height=300');
            popupWindow.document.write(popupHTML);
            // Add event listener to handle option selection
            popupWindow.document.addEventListener('click', function(event) {
              var selectedInput = event.target.closest('input[type="radio"]');
              if (selectedInput) {
                var selectedOption = selectedInput.value;
                inputElements.forEach(function (input) {
                  if (input.getAttribute('data-test-text-selectable-option__input') === selectedOption) {
                    input.checked = true;
                    input.click(); // Trigger click event on the original input
                  }
                });
                // Close the popup window
                popupWindow.close();
              }
            });
          }
        }
      }
  
      // handles dropdown questions
      var dropdownLabels = questionDiv.querySelectorAll('.fb-dash-form-element[data-test-form-element] label[for^="text-entity-list-form-component"]');
      dropdownLabels.forEach(function (label) {
        var labelText = label.textContent.trim();
        var splitIndex = Math.floor(labelText.length / 2);
        labelText = labelText.substring(0, splitIndex).trim();
        console.log('Dropdown Question:', labelText);
        var multipleChoiceSelector = questionDiv.querySelector('select');
        if (multipleChoiceSelector) {
          var multipleChoiceOptions = multipleChoiceSelector.querySelectorAll('option');
          var selectedOption = multipleChoiceSelector.value.toLowerCase();
          if (selectedOption === 'select an option' || selectedOption === '') {
            var options = [];
            multipleChoiceOptions.forEach(function (multipleChoiceOption) {
              var multipleChoiceOptionText = multipleChoiceOption.textContent.trim();
              if (multipleChoiceOptionText.toLowerCase() !== 'select an option' && multipleChoiceOptionText !== '') {
                options.push(multipleChoiceOptionText);
              }
            });
            // Create popup.html with question and options
            var popupHTML = `
              <h3>${labelText}</h3>
              <ul>
                ${options.map(option => `
                  <li>
                    <div style="border: 1px solid black; padding: 5px; margin-bottom: 5px;" data-option="${option}">
                      <label>
                        <input type="radio" name="${labelText}" value="${option}" />
                        ${option}
                      </label>
                    </div>
                  </li>
                `).join('')}
              </ul>
            `;
            // Open the popup.html in a new window
            var popupWindow = window.open('', '', 'width=400,height=300');
            popupWindow.document.write(popupHTML);
            // Add event listener to handle option selection
            popupWindow.document.addEventListener('click', function(event) {
              var selectedDiv = event.target.closest('div[data-option]');
              if (selectedDiv) {
                var selectedInput = selectedDiv.querySelector('input[type="radio"]');
                if (selectedInput) {
                  var selectedOption = selectedInput.value;
                  multipleChoiceSelector.value = selectedOption;
                  // Trigger change event on the original select element
                  var changeEvent = new Event('change');
                  multipleChoiceSelector.dispatchEvent(changeEvent);
                  // Close the popup window
                  popupWindow.close();
                }
              }
            });
          }
        }
      });
    });
  }
  
  

  
  async function applyForJob() {
    dismissJobsApplied();
    removeDismissedJobs();
    removeAppliedJobs();
    try {
      await clickAndWait('.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', 1011);
    } catch (error) {
      console.log('Apply button not found');
    }    
    while (true) {
      try {
        // await getRadioQuestions();
        extractQuestions();
        await clickAndWait('button[aria-label="Continue to next step"]', 3000);
      } catch (error) {
        console.log('Continue button not found');
        break; // Exit the loop if the "Continue to next step" button is not found
      }
    }
    while (true){
      try {
        extractQuestions();
        await clickAndWait('button[aria-label="Review your application"]', 3000);
      } catch (error) {
        console.log('Review button not found');
        break; // Exit the loop if the "Review your application" button is not found
      }
    }
  
    try {
      uncheckCheckbox('#follow-company-checkbox');
      await clickAndWait('button[aria-label="Submit application"]', 3000);
      exitJob();
    } catch (error) {
      console.log('Submit button not found');
    }
  }
  function applyManyJobs() {
  }

  applyForJob();
  // extractQuestions();
  // printRadioButtonQuestions();

  
}