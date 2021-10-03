(function iife() {
  function getFirstOfMonth(month = new Date()) {
    month.setDate(1)
    return month
  }

  function getDaysInMonth(month) {
    var date = new Date(month.getTime())
    var days = []
    while (date.getMonth() === month.getMonth()) {
      days.push(new Date(date))
      date.setDate(date.getDate() + 1)
    }
    return days
  }

  function generateDaysHtml(month) {
    const days = getDaysInMonth(month)
    const dateFormatter = new Intl.DateTimeFormat(navigator.language)
    return days.map((day, i) => {
        const className = i === 0 ? `day-${day.getDay()} first-of-month-day-${day.getDay()}` : `day-${day.getDay()}`
        return `
          <button class="${className}">
            <time datetime="${dateFormatter.format(day)}">${day.getDate()}</time>
          </button>
        `
      })
      .join('\n')
  }

  function renderDays(month) {
    const daysHtml = generateDaysHtml(month)
    const dateGrid = document.querySelector('.date-grid')
    dateGrid.innerHTML = daysHtml
  }

  function renderMonth(month) {
    const dateFormatter = new Intl.DateTimeFormat(navigator.language, { month: 'long', year: 'numeric' })
    const monthHTML = `<time>${dateFormatter.format(month)}</time>`
    document.querySelector('.month').innerHTML = monthHTML
  }

  function renderCalendar(month) {
    renderDays(month)
    renderMonth(month)
  }

  function renderDaysOfWeek() {
    // days are hardcoded UTC timestamps to a week that begins on sunday and ends on saturday
    const sundayThroughSaturdayUTCUnixTimes = [1583038800000, 1583125200000, 1583211600000, 1583298000000, 1583384400000, 1583470800000, 1583557200000]
    const dateFormatter = new Intl.DateTimeFormat(navigator.language, { weekday: 'narrow' })
    const daysOfWeekHTML = sundayThroughSaturdayUTCUnixTimes
      .map(timestamp => {
        const date = new Date(timestamp)
        return `<div class="day-${date.getDay()}">${dateFormatter.format(date)}</div>`
      })
      .join('\n')
    document.querySelector('.day-of-week').innerHTML = daysOfWeekHTML
  }

  function addEventTogglers(month) {
    function reRenderCalendar({ target: { dataset: { direction } } }) {
      if (direction === 'backward') {
        month.setMonth(month.getMonth() - 1)
      } else {
        month.setMonth(month.getMonth() + 1)
      }
      renderCalendar(month)
    }
    const toggles = document.querySelectorAll('.toggle')
    for (const toggle of toggles) {
      toggle.addEventListener('click', reRenderCalendar)
    }
  }

  function renderHTML() {
    const month = getFirstOfMonth()
    renderCalendar(month)
    renderDaysOfWeek()
    addEventTogglers(month)
  }

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn()
    } else {
      document.addEventListener('DOMContentLoaded', () => fn())
    }
  }

  onReady(renderHTML)
})()
