 $(document).ready(function() {
     $('#nutthem').on("click", openForm);
     //Load lại dữ liệu
     $('.refresh-btn').on("click", () => {
         $('table tbody').empty();
         loadData();
     });

     $('table tbody').on("dblclick", 'tr', openForm);
     /**
      * Chuyển đổi qua lại tên class page <-> closeLogo để làm sidebar
      */
     $('.logo-page').on("click", () => {
         //$('.item-text').hide();
         $('.page').toggleClass('closeLogo');
     })


     loadData();

 });

 /**Hiển thị form nhập thông tin */
 function openForm() {

     $('#myForm').show();

     //Focus vào ô input đầu tiên và tab khi đến cuối sẽ trở lại thẻ input
     $('#txtEmployeeCode').focus();
     $('#repeat').on("focus", () => {
         $('#txtEmployeeCode').focus();
     });

     //Làm mờ page
     //$('#page-opa').animate('opacity') = '0.6'; 
     $('#page-opa').fadeTo("300", 0.7);


     /**
      * Validate bắt buộc nhập
      */

     //Validate cho input
     // Lấy input có attribute required 
     $('.form-content input[required]').blur(function() {
         // Nếu ô input bắt buộc nhập có giá trị rỗng thì viền chuyển đỏ
         if (!$(this).val())
             $(this).addClass('erro-inp');
         else $(this).removeClass('erro-inp');
     });

     //if($('.form-content input[required]').val()){
     $('#nutluu').on("click", () => {
         var genderCode = $("#txtGenderName").val().toLowerCase();
         if (genderCode == "nam") genderCode = 1;
         else if (genderCode == "nữ") genderCode = 0;
         else genderCode = 2;

         var inputs = $('input[fieldname]');
         var newEmployee = {};
         $.each(inputs, function(index, input) {
             var prop = $(this).attr('fieldname');
             var value = $(this).val();
             newEmployee[prop] = value;

         })

         newEmployee['Gender'] = genderCode;

         debugger

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
     //}


     $('.cancel-btn').on('click', closeForm);



 }

 function closeForm() {
     $('#myForm').hide();
     $('#page-opa').fadeTo("100", 1);
 }

 /**Load data danh sách nhân viên */
 function loadData() {
     //Lấy dữ liệu về
     $.ajax({
             url: "http://cukcuk.manhnv.net/api/v1/Customerss",
             method: "GET",
         }).done((res) => {
             $.each(res, function(index, item) {
                 var ths = $('table thead th');
                 var tr = $(`<tr></tr>`);
                 $.each(ths, function(index, i) {
                     var fieldName = $(i).attr("fieldname");

                     // Thêm class cho td
                     var addClass = fieldName.toLowerCase();
                     if (fieldName == "STT") {
                         var td = `<td><div class="checkbox"><span><input type="checkbox"></span></div></td>`;
                     } else {
                         //Format định dạng dữ liệu
                         var itemData = formatData(item[fieldName], fieldName);
                         var td = "<td><div class=" + addClass + "><span>" + itemData + "</span></div></td>";
                     }
                     $(tr).append(td);
                     // console.log(tr);
                     // debugger

                 })
                 $('table tbody').append(tr);
             })

         }).fail((res) => {

         })
         //Binding dữ liệu lên table
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

     if (field == "Gender") {
         if (data == 1) data = 'Nam';
         if (data == 2) data = 'Nữ';
         if (data == null) data = ' ';
         return data;
     }


     //Nếu dữ liệu null hoặc không xác định trả về chuỗi trống
     if (data == null || data == "Không xác định") return str;
     return data;
 }