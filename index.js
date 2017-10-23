const http = require('http')

http.get('http://www.therichest.com/top-lists/top-250-richest-people-in-the-world/', (response) => {
  let html = ''
  response.on('data', (data) => {
    html += data.toString()
  })
  
  response.on('end', () => {
    const rankIndex = html.indexOf('<td class="rank">#1</td>')
    const nameStart = html.indexOf('<span>', rankIndex) + 6
    const nameEnd = html.indexOf('</span>', nameStart)
    const name = html.substring(nameStart, nameEnd)
    
    const s = '<td class="netWorth">'
    const netWorthStart = html.indexOf(s , nameEnd) + s.length
    const netWorthEnd = html.indexOf('</td>', netWorthStart)
    const netWorth = html.substring(netWorthStart + 1, netWorthEnd - 2)
    console.log(netWorth)
  })
})