      // div.fb-dash-form-element[data-test-form-element] label[for^="single-typeahead-entity-form-component"]
  //     <div id="single-typeahead-entity-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3788477971-9054483911573926553-city-HOME-CITY-ta" class="search-basic-typeahead search-vertical-typeahead">
  // <!---->        
      
  //     <input id="single-typeahead-entity-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3788477971-9054483911573926553-city-HOME-CITY" required="" role="combobox" aria-autocomplete="list" aria-activedescendant="" aria-expanded="false" type="text" aria-describedby="single-typeahead-entity-form-component-formElement-urn-li-jobs-applyformcommon-easyApplyFormElement-3788477971-9054483911573926553-city-HOME-CITY-error">
    
  // <!---->  
  //     </div>

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
  async function clickAndWait(buttonSelector, waitTime) {
      var button = document.querySelector(buttonSelector);
      if (button) {
        button.dispatchEvent(new Event('click', { bubbles: true })); // Trigger the click event and allow it to bubble up the DOM
        await delay(waitTime)
      } else {
        console.log(`Button '${buttonSelector}' not found`);
        reject(new Error(`Button '${buttonSelector}' not found`)); // Reject the promise if the button is not found
      }
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async function pressWithRetry(selector, delayTime = 500, waitTime = 3000) {
    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 16;

      const intervalId = setInterval(async () => {
        var button = document.querySelector(selector);
        if (button) {
          button.click();
          button.dispatchEvent(new Event('click', { bubbles: true })); // Trigger the click event and allow it to bubble up the DOM
          clearInterval(intervalId); // Stop checking once the button is found and clicked
          await delay(waitTime);
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(intervalId); // Stop checking after 16 unsuccessful attempts
          }
        }
      }, delayTime); // Check every 500 milliseconds
      resolve();
    });
  }

  function uncheckCheckbox(checkboxSelector) {
    return new Promise((resolve) => {
      var checkbox = document.querySelector(checkboxSelector);
      if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger the change event and allow it to bubble up the DOM
      } else {
        console.log(`Checkbox '${checkboxSelector}' not found`);
      }
      resolve();
    });
  }




  function removeAppliedJobs() {
    return new Promise((resolve) => {
      var jobsResultsList = document.querySelector('div.jobs-search-results-list');
      if (jobsResultsList) {
        var liJobList = document.querySelectorAll('li.jobs-search-results__list-item');
        if (liJobList){
          for (const liJobCard of liJobList) {
            var jobCardStatus = liJobCard.querySelector('ul.job-card-list__footer-wrapper li.job-card-container__footer-job-state');
            if (jobCardStatus) {
              var jobCardStatusText = jobCardStatus.textContent.trim();
              if (jobCardStatusText === 'Applied') {
                liJobCard.remove();
              }
            }
          }
        }
      }
      resolve();
    });
  }

  function removeDismissedJobs() {
    return new Promise((resolve) => {
      var lijobList = document.querySelectorAll('li.jobs-search-results__list-item');
      for (const lijob of lijobList) {
        if (lijob.querySelector('div.job-card-container--clickable.job-card-list--is-dismissed')){
          lijob.remove();
        }
      }
      resolve();
    });
  }

  function dismissJobsApplied(){
    return new Promise((resolve) => {
      var jobsList = document.querySelector('div.jobs-search-results-list');
      if (jobsList) {
        var jobCards = jobsList.querySelectorAll('div.job-card-container--clickable');
        if (jobCards) {
          for (const jobCard of jobCards) {
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
          }
        }
      }
      resolve();
    });
  }
  async function processQuestions(selector) {
    const questionDivs = document.querySelectorAll(selector);
    if (!questionDivs) {
      console.log('No questions found');
      return;
    }
    for (const questionDiv of questionDivs) {
      try {
        await extractQuestion(questionDiv);
      } catch (error) {
        console.error('Error processing question:', error);
        break;
      }
    }
  }
  // return new Promise((resolve) => {
    // var questionDivs = document.querySelectorAll('div.jobs-easy-apply-form-section__grouping');
    // questionDivs.forEach(async function (questionDiv) {
  
  async function extractQuestion(questionDiv) {
    // handles text input questions
    var textInputElement = questionDiv.querySelector('div.fb-dash-form-element[data-test-form-element] label[for^="single-line-text-form-component"]');
    if (textInputElement) {
      var labelText = textInputElement.textContent.trim();
      console.log('Text Input Question:', labelText);
      var inputBox = questionDiv.querySelector('input.artdeco-text-input--input');
      if (inputBox) {
        var inputValue = inputBox.value;
        if (inputValue === '' || inputValue === null) {
          await new Promise((resolve) => {
            setTimeout(() => {
              var newInputValue = prompt('Please enter a value:\n' + labelText);
              inputBox.value = newInputValue;
              // Trigger input event to simulate user input
              var inputEvent = new Event('input', { bubbles: true });
              inputBox.dispatchEvent(inputEvent);
              resolve();
            }, 0);
          });
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
      } else if (fieldset.parentElement.parentElement.parentElement.children[1].classList.contains('inline-block', 't-14', 't-bold', 'mt4')) {
        console.log('Inside of fieldset with ')
        var spanChildren = Array.from(fieldset.parentElement.parentElement.parentElement.children).slice(1, 3);
        var textContent = spanChildren.map(function (span) {
          return span.textContent.trim();
        }).join('\n');
      }
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
        await new Promise((resolve) => {
          popupWindow.document.addEventListener('click', function (event) {
            var selectedInput = event.target.closest('input[type="radio"]');
            if (selectedInput) {
              var selectedOption = selectedInput.value;
              inputElements.forEach(function (input) {
                if (input.getAttribute('data-test-text-selectable-option__input') === selectedOption) {
                  input.checked = true;
                  var changeEvent = new Event('change', { bubbles: true });
                  input.parentElement.children[0].dispatchEvent(changeEvent);
                }
              });
              // Close the popup window after handling selection
              popupWindow.close();
              resolve();
            }
          });
        });
      }
    }
    // handles dropdown questions
    var dropdownLabels = questionDiv.querySelectorAll('.fb-dash-form-element[data-test-form-element] label[for^="text-entity-list-form-component"]');
    for (const label of dropdownLabels) {
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
          await new Promise((resolve) => {
            popupWindow.document.addEventListener('click', function (event) {
              var selectedDiv = event.target.closest('div[data-option]');
              if (selectedDiv) {
                var selectedInput = selectedDiv.querySelector('input[type="radio"]');
                if (selectedInput) {
                  var selectedOption = selectedInput.value;
                  multipleChoiceSelector.value = selectedOption;
                  // Trigger change event on the original select element
                  var changeEvent = new Event('change');
                  multipleChoiceSelector.dispatchEvent(changeEvent);
                  // Close the popup window after handling selection
                  popupWindow.close();
                  resolve();
                }
              }
            });
          });
        }
      }
    }
  }    
  
  function exitJob() {
    return new Promise((resolve,reject) => {
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
              // send click event to the dismiss button
              var clickEvent = new Event('click', { bubbles: true });
              dissmissButton.dispatchEvent(clickEvent);
              clearInterval(intervalId); // Stop checking once the button is found and clicked
            }
          }
        }
        attempts++;
        if (attempts >= maxAttempts) {
          clearInterval(intervalId); // Stop checking after 16 unsuccessful attempts
          reject(new Error('Exit job button not found'));
        }
      }, 500); // Check every 500 milliseconds
      resolve();
    });
  }

  async function applyForJob() {
      try {
        // wait for 2 seconds
        await delay(2000);
        await clickAndWait('.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view');
        // pressWithRetry('.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view');
      } catch (error) {
        console.log('Apply button not found');
      }
      try{
        await clickAndWait('button[aria-label="Continue to next step"]', 3000);
      } catch (error) {
        console.log('Continue to next step button not found');
      }
      await delay(1000);
      console.log('GOT TO AFTER pressing EASY APPLY BUTTON');
      while (true) {
        try{
          // try and process the questions on the page.
          await processQuestions('div.jobs-easy-apply-form-section__grouping');
          try {
            console.log('Continue to next step button found')
            // try and continue to the next page.
            await clickAndWait('button[aria-label="Continue to next step"]', 3000);
          }catch{
            try{
              console.log('Continue to next step button not found');
              // If the continue button is gone, try and press the review application button.
              await clickAndWait('button[aria-label="Review your application"]', 3000);
              console.log('Review your application button found');
            }catch{
              console.log('Review button not found');
              // Try and uncheck the follow company checkbox if the review application button is gone.
              await uncheckCheckbox('#follow-company-checkbox');
              console.log('Follow company checkbox unchecked');
              try{
                // If the review button is gone, try and press the submit application button.
                await clickAndWait('button[aria-label="Submit application"]', 3000); 
                console.log('Submit application button found');
                try{
                  await exitJob(); // Wait for exitJob to complete before resolving the promise
                } catch (error) {
                  console.log(error.message);
                }
                break;
              }catch{
                console.log('Submit button not found');
                break;
              }

            }
          }
        } catch (error) {
          console.log('Questions not found');
          break;
        }
      }
  }

  async function applyForAllJobs() {
    var jobsList = document.querySelector('div.jobs-search-results-list');
    if (jobsList) {
      var jobCards = jobsList.querySelectorAll('div.job-card-container--clickable');
      if (jobCards) {
        for (const jobCard of jobCards) {
          jobCard.click();
          
          await applyForJob();
          await new Promise(resolve => setTimeout(resolve, 2222));
        }
      }
    }
  }

  async function goToNextPage() {
    // assumes you start from page 1.
    // Get the pagination container
    const paginationContainer = document.querySelector('div.jobs-search-results-list__pagination');
  
    if (paginationContainer) {
      // Get the list of page buttons
      const pageButtons = paginationContainer.querySelectorAll('li.artdeco-pagination__indicator--number button');
  
      // Find the current page button
      const currentPageButton = Array.from(pageButtons).find(button => button.getAttribute('aria-current') === 'true');
  
      if (currentPageButton) {
        // Update the current page number
        currentPage = parseInt(currentPageButton.textContent, 10);
        console.log('Current page:', currentPage);
      }
  
      // Find the next page button
      const nextPageButton = Array.from(pageButtons).find(button => parseInt(button.textContent, 10) === currentPage + 1);
  
      if (nextPageButton) {
        // Click the next page button
        nextPageButton.click();
        // Update the current page number
        currentPage++;
      } else {
        console.log('Next page button not found');
      }
    } else {
      console.log('Pagination container not found');
    }
  }
  let currentPage = 1;
  async function applyManyPages() {
    let currentPage = 1;
    for (let i = 0; i < 5; i++) {
      await dismissJobsApplied();
      // await removeDismissedJobs();
      // await removeAppliedJobs();
      await applyForAllJobs();
      await goToNextPage();
    }
  }
  applyManyPages();
}
  