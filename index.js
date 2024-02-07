// Define months globally
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

document.addEventListener("DOMContentLoaded", function () {
  // Increase and decrease buttons for card (2)
  const decreaseButtons2 = document.getElementsByName("decrease2");
  const increaseButtons2 = document.getElementsByName("increase2");
  const countInput2 = document.querySelector("#PeriodDays");

  decreaseButtons2.forEach((button) => {
    button.addEventListener("click", function () {
      decreaseCount(countInput2);
    });
  });

  increaseButtons2.forEach((button) => {
    button.addEventListener("click", function () {
      increaseCount(countInput2);
    });
  });

  // Increase and decrease buttons for card (3)
  const decreaseButtons3 = document.getElementsByName("decrease3");
  const increaseButtons3 = document.getElementsByName("increase3");
  const countInput3 = document.querySelector("#PeriodCycle");

  decreaseButtons3.forEach((button) => {
    button.addEventListener("click", function () {
      decreaseCount(countInput3);
    });
  });

  increaseButtons3.forEach((button) => {
    button.addEventListener("click", function () {
      increaseCount(countInput3);
    });
  });

  function decreaseCount(inputElement) {
    const currentValue = parseInt(inputElement.value);
    if (currentValue > 1) {
      inputElement.value = currentValue - 1;
    }
  }

  function increaseCount(inputElement) {
    const currentValue = parseInt(inputElement.value);
    inputElement.value = currentValue + 1;
  }

  // Event listener for "See results" button
  const seeResultsButton = document.querySelector(".btn-primary");
  seeResultsButton.addEventListener("click", function () {
    calculateAndDisplayResults();
  });
});

// JavaScript to update displayed date when user selects a date
const selectedDateInput = document.getElementById("selectedDate");
const selectedDayElement = document.getElementById("selectedDay");
const selectedMonthElement = document.getElementById("selectedMonth");
const selectedYearElement = document.getElementById("selectedYear");

selectedDateInput.addEventListener("change", function () {
  const selectedDate = new Date(this.value);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Update the displayed day, month, and year
  selectedDayElement.textContent = selectedDate.toLocaleDateString("en-US", {
    day: "numeric",
  });
  selectedMonthElement.textContent = selectedDate.toLocaleDateString("en-US", {
    month: "long",
  });
  selectedYearElement.textContent = selectedDate.toLocaleDateString("en-US", {
    year: "numeric",
  });
});

function GetDaysOfMonth(year) {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  const monthsDays = {
    January: 31,
    February: isLeapYear ? 29 : 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    August: 31,
    September: 30,
    October: 31,
    November: 30,
    December: 31,
  };

  return monthsDays;
}

// Function to calculate menstrual cycle and display results
function calculateAndDisplayResults() {
  // Get inputs
  const lastPeriodStartDay = parseInt(
    document.getElementById("selectedDay").textContent
  );
  const lastPeriodDuration = parseInt(
    document.getElementById("PeriodDays").value
  );
  const cycleLength = parseInt(document.getElementById("PeriodCycle").value);
  const selectedDate = new Date(document.getElementById("selectedDate").value);
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Generate calendar HTML
  const calendarHTML = generateCalendarDays(
    lastPeriodStartDay,
    lastPeriodDuration,
    cycleLength,
    year,
    month
  );

  // Display results
  const allCardsElement = document.getElementById("all-cards");
  allCardsElement.innerHTML = calendarHTML;
}

function generateCalendarDays(
  lastPeriodStartDay,
  lastPeriodDuration,
  cycleLength,
  year,
  month
) {
  // Initialize an array to store the generated HTML for each month
  var calendarHTML = [];

  // Determine if the current year is a leap year
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // Loop through the current month and the next two months
  for (let i = 0; i < 3; i++) {
    // Calculate the month and year for the current iteration
    const currentMonth = (month + i) % 12;
    const currentYear = year + Math.floor((month + i) / 12);

    // Determine the number of days in the current month
    const daysInMonth = GetDaysOfMonth(currentYear)[months[currentMonth]];

    // Initialize arrays to store fertile, infertile, and bleeding days
    const fertileDays = [];
    const infertileDays = [];
    const bleedingDays = [];

    // Loop through each day of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      // Determine if the day is fertile, infertile, or bleeding based on the cycle
      const cycleStart = (lastPeriodStartDay + lastPeriodDuration) % cycleLength;
      const dayInCycle = (cycleStart + day - 1) % cycleLength;

      if (day <= lastPeriodDuration) {
        bleedingDays.push(day);
      } else if (dayInCycle < 7) {
        fertileDays.push(day);
      } else if (dayInCycle >= 7 && dayInCycle < 21) {
        infertileDays.push(day);
      } else {
        fertileDays.push(day);
      }
    }

    // Generate HTML for the current month
    const monthHTML = `<div class="calendar-month ng-scope">
                                <h3 class="ng-binding">${
                                  months[currentMonth]
                                } ${currentYear}</h3>
                                <div class="calendar-days">
                                    ${generateDayHTML(
                                      daysInMonth,
                                      fertileDays,
                                      infertileDays,
                                      bleedingDays
                                    )}
                                </div>
                            </div>`;

    // Add the HTML for the current month to the calendar array
    calendarHTML.push(monthHTML);
  }

  // Return the generated HTML for all three months
  return calendarHTML.join("");
}

function generateDayHTML(
  daysInMonth,
  fertileDays,
  infertileDays,
  bleedingDays
) {
  let dayHTML = "";
  for (let day = 1; day <= daysInMonth; day++) {
    let className = "";
    if (bleedingDays.includes(day)) {
      className = "pink";
    } else if (fertileDays.includes(day)) {
      className = "fertile";
    }
    dayHTML += `<div class="day ng-binding ng-scope ${className}">${day}</div>`;
  }
  return dayHTML;
}
