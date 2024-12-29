const today = new Date();
$(document).ready(function () {

    async function getData() {
        const response = await fetch('./new_charlist.json');
        const myList = await response.json()
        return myList;
    }

    getData().then(myList => {
        var columns = [];
        var tableData = JSON.parse(JSON.stringify(myList));

        for (var c in tableData) {
            var banner_date = tableData[c]['Banner Dates']

            if (banner_date[banner_date.length - 1][1] == 'TBA') {
                tableData[c]['Days Since Last'] = "Coming Soon"
                tableData[c]['hidden'] = 9999
                if (banner_date.length != 1) {
                    if (banner_date[banner_date.length - 2][1] == 'Indefinite') {
                        var last = dateDiff(banner_date[banner_date.length - 2][0])
                    } else {
                        var last = dateDiff(banner_date[banner_date.length - 2][1])
                    }
                    tableData[c]['hidden'] = last
                    tableData[c]['Days Since Last'] = last + " Days<br>Coming Soon"
                }
            } else {
                var last = dateDiff(banner_date[banner_date.length - 1][1])
                if (last > 0) {
                    tableData[c]['Days Since Last'] = last + " Days"
                } else {
                    tableData[c]['Days Since Last'] = "Ongoing"
                }
                tableData[c]['hidden'] = last
            }
        }

        columnNames = Object.keys(tableData[0]);

        for (var i in columnNames) {
            columns.push({
                data: columnNames[i],
                title: columnNames[i],
            });
        }
        var table = $('#excelDataTable').DataTable({
            "data": tableData,
            "columns": columns,
            autoWidth: true,
            order: [[4, 'desc']],
            paging: false,
            columnDefs: [{
                "defaultContent": "",
                "targets": "_all",
                "render": function (data) {
                    if (typeof (data) == "object") {
                        var printed = ""
                        for (var k in data) {
                            var dat_string = "<li>" + data[k][0] + " - " + data[k][1] + "</li>"
                            printed += dat_string + "<br>"
                        }
                        return printed
                    } else {
                        return data
                    }
                },
            },
            {
                target: 0, width: '150px'
            },
            {
                target: 1, orderable: false
            },
            {
                target: 2, width: '100px'
            },
            {
                target: 3, orderData: [4]
            },
            {
                target: 4, visible: false
            }
            ],
            createdRow: function (row, data, dataIndex) {
                if (data['hidden'] <= 0) {
                    $(row).addClass('og');
                } else if (data['hidden'] < 160 && data['hidden'] > 0) {
                    $(row).addClass('bd');
                } else if (data['hidden'] < 320 && data['hidden'] >= 160) {
                    $(row).addClass('rd');
                } else if (data['hidden'] < 480 && data['hidden'] >= 320) {
                    $(row).addClass('rd2');
                } else if (data['hidden'] < 9000 && data['hidden'] >= 480) {
                    $(row).addClass('ada');
                } else if (data['hidden'] > 9000) {
                    $(row).addClass('cs');
                }

                if (data['Name'].includes("*")) {
                    $(row).addClass('hide');
                }
            }
        });
    })
});

function trigger() {
    var current = document.getElementById('trigger');
    var curr_class = current.className;

    var krow = document.getElementsByClassName('hide')
    if (curr_class == "on") {
        current.className = "off"
        current.textContent = "Show Permanent"
        var visibility = "none"
    } else {
        current.className = "on"
        current.textContent = "Hide Permanent"
        var visibility = ""
    }
    for (var j in krow) {
        krow[j].style.display = visibility
    }

    console.log(curr_class)
}

function dateDiff(date) {
    var converted_date2 = new Date(date);
    var diffTime = today - converted_date2;
    var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays
}