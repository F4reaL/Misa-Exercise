$(document).ready(function() {
    loadData();
    $('.refresh-btn').on("click", () => {
        $('table tbody').empty();
        loadData();
    });
    //Mở popup
    $('.add-new-employee').on("click", openForm);
    //Double click để mở popup
    $('table tbody').on("dblclick", 'tr', openForm);
})

/**Load data danh sách nhân viên */
function loadData() {
    //Lấy dữ liệu về
    $.ajax({
        url: "http://cukcuk.manhnv.net/api/v1/Employees",
        method: "GET",
    }).done((res) => {
        $.each(res, function(index, item) {
            var ths = $('table thead th');
            var tr = $(`<tr></tr>`);
            $.each(ths, function(index, i) {
                var fieldName = $(i).attr("fieldname");
                // Thêm class cho td
                var addClass = fieldName;
                // Thêm checkbox vào cột STT
                if (fieldName == "STT") {
                    var td = `<td><div class="checkbox"><span><input type="checkbox"></span></div></td>`;
                } else {
                    //Format định dạng dữ liệu
                    var itemData = formatData(item[fieldName], fieldName);
                    var td = "<td><div class=" + addClass + "><span>" + itemData + "</span></div></td>";
                }
                $(tr).append(td);
            })
            $('table tbody').append(tr);
        })
    }).fail((res) => {

    })
}

/**
 * 
 * @param {item[fieldName]} data 
 * @param {fieldName} field 
 * @returns Định dạng đúng của dữ liệu
 */
function formatData(data, field) {
    var str = " ";
    //Định dạng tiền tệ
    if (field == "DebitAmount")
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'VND',
        }).format(data);

    //Định dạng lại ngày tháng năm sinh
    if (field == "DateOfBirth") {
        var date = new Date(data);
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month
        var year = date.getFullYear();
        return day + "/" + month + "/" + year;
    }


    //Nếu dữ liệu null hoặc không xác định trả về chuỗi trống
    if (data == null || data == "Không xác định") return str;
    return data;
}


/**Hiển thị form nhập thông tin */
function openForm() {

    $('.popup').show();
    $('.page').fadeTo("1000", 0.7);


    $('.save-btn').on("click", () => {
        var inputs = $('input[fieldname]');
        console.log(inputs);
        var newEmployee = {};
        $.each(inputs, function(index, input) {
            var prop = $(this).attr('fieldname');
            var value = $(this).val();
            newEmployee[prop] = value;
        })
        $.ajax({
            url: 'http://cukcuk.manhnv.net/api/v1/Customerss',
            method: 'POST',
            data: JSON.stringify(newEmployee),
            contentType: 'application/json'
        }).done(function(res) {
            console.log(newEmployee);
            debugger
            alert("Thêm thành công!!!");
            closeForm();


        }).fail(function(res) {
            alert("Thêm thất bại!!!");
            console.log(res);

        });

    });
    $('.cancel-btn').on('click', closeForm);
}

//Đóng popup
function closeForm() {
    $('.popup').hide();
    $('.page').fadeTo("100", 1);
}