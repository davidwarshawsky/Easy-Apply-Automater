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

  // Function to print information about fieldsets
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
    // jobs are inside of div class="jobs-search-results-list"
    // job cards are described inside of the above div with div.job-card-container--clickable
    // the job card's status is described in the above div in ul class="job-card-list__footer-wrapper" and then 
    // li class="job-card-container__footer-job-state" and the text is "Applied"
    // if the job card is applied, then the job card is removed from the page
    // if the job card is not applied, then the job card is not removed from the page
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
  
  async function applyForJob() {
    removeDismissedJobs();
    removeAppliedJobs();
    try {
      await clickAndWait('.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', 1011);
    } catch (error) {
      console.log('Apply button not found');
    }    
    while (true) {
      try {
        await clickAndWait('button[aria-label="Continue to next step"]', 3000);
      } catch (error) {
        console.log('Continue button not found');
        break; // Exit the loop if the "Continue to next step" button is not found
      }
    }
  
    try {
      await clickAndWait('button[aria-label="Review your application"]', 3000);
    } catch (error) {
      console.log('Review button not found');
    }
  
  
    try {
      uncheckCheckbox('#follow-company-checkbox');
      await clickAndWait('button[aria-label="Submit application"]', 3000);
      exitJob();
    } catch (error) {
      console.log('Submit button not found');
    }
  }
  

  // function applyForJob() {
  //     clickAndWait('.jobs-apply-button.artdeco-button.artdeco-button--3.artdeco-button--primary.ember-view', 1011)
  //     .then(() => clickAndWait('button[aria-label="Continue to next step"]', 2000))
  //     .then(() => clickAndWait('button[aria-label="Continue to next step"]', 2000))
  //     .then(() => clickAndWait('button[aria-label="Review your application"]', 2000))
  //     .then(() => uncheckCheckbox('#follow-company-checkbox'))
  //     .then(() => clickAndWait('button[aria-label="Submit application"]', 2000))
  //     .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // }
  // run the function to apply for job
  applyForJob();
}