const today = new Date();
$(document).ready(function () {

    async function getData() {
        const response = await fetch('./Banner/new_charlist.json');
        const myList = await response.json()
        return myList;
    }

    getData().then(myList => {
        var columns = [];
        var tableData = JSON.parse(JSON.stringify(myList));

        for (var c in tableData) {
            var banner_date = tableData[c]['Banner Dates']

            tableData[c]['Days Since Last'] = "Coming Soon"
            tableData[c]['hidden'] = 9999
            if (banner_date[banner_date.length - 1][1] == 'TBA') {
                if (banner_date.length != 1) {
                    if (banner_date[banner_date.length - 2][1] == 'Indefinite') {
                        var last = dateDiff(banner_date[banner_date.length - 2][0])
                    } else {
                        var last = dateDiff(banner_date[banner_date.length - 2][1])
                    }
                    tableData[c]['hidden'] = last
                    tableData[c]['Days Since Last'] = "Last since " + last + " Days<br>Coming Soon"
                }
            } else {
                var first = dateDiff(banner_date[banner_date.length - 1][0])
                var last = dateDiff(banner_date[banner_date.length - 1][1])
                tableData[c]['hidden'] = last;
                if (last > 0) {
                    tableData[c]['Days Since Last'] = last + " Days"
                } else {
                    if (first < 0) {
                        tableData[c]['hidden'] = 9999;
                        tableData[c]['Days Since Last'] = "Coming Soon in " + -(first) + " Days";
                    } else {
                        tableData[c]['hidden'] = 10001;
                        tableData[c]['Days Since Last'] = "Ongoing";
                    }
                }
            }
        }

        console.log(tableData)

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
                        for (var k = data.length - 1; k >= 0; k--) {
                            if (k != data.length - 1) {
                                var dat_string = "<li class=\"nlast\">" + data[k][0] + " - " + data[k][1] + "</li>"
                            } else {
                                var dat_string = "<li>" + data[k][0] + " - " + data[k][1] + "</li>"
                            }
                            printed += dat_string
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
                target: 4, visible: false, searchable: false
            }
            ],
            createdRow: function (row, data, dataIndex) {
                if (data['hidden'] < 160 && data['hidden'] > 0) {
                    $(row).addClass('bd');
                } else if (data['hidden'] < 320 && data['hidden'] >= 160) {
                    $(row).addClass('rd');
                } else if (data['hidden'] < 480 && data['hidden'] >= 320) {
                    $(row).addClass('rd2');
                } else if (data['hidden'] < 9000 && data['hidden'] >= 480) {
                    $(row).addClass('ada');
                } else if (data['hidden'] < 10000 && data['hidden'] >= 9000) {
                    $(row).addClass('cs');
                } else if (data['hidden'] > 10000) {
                    $(row).addClass('og');
                }

                if (data['Name'].includes("*")) {
                    $(row).addClass('perm');
                }
            }
        });
    })
});

function trigger(button) {
    var current = document.getElementById(button.id);
    var curr_class = current.className;

    if (curr_class.includes("on")) {
        current.classList.remove("on")
        current.classList.add("off")
        var visibility = "none"
    } else {
        current.classList.remove("off")
        current.classList.add("on")
        var visibility = ""
    }
    var krow = document.getElementsByClassName(current.classList[1])
    for (var j = 0; j < krow.length; j++) {
        if (!krow[j].className.includes("box")) {
            krow[j].style.display = visibility
        } else {
            if (visibility == "") {
                krow[j].children[0].style.display = ""
                krow[j].children[1].style.display = "none"
            } else {
                krow[j].children[0].style.display = "none"
                krow[j].children[1].style.display = ""
            }
        }
    }

    console.log(curr_class)
}

function dateDiff(date) {
    var converted_date2 = new Date(date);
    var diffTime = today - converted_date2;
    var diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays
}