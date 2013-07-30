$(document).ready(function(){
	if ((window.location.href).indexOf("book.douban") > 0 ) {
		// get book title
		var title = $('h1').text();
		//title = title.replace(" ","");
		//var title = document.title.substr(0,document.title.length-5)
		//title = encodeURIComponent(title);
		var isbn;
		// get book isbn
		$("#info  .pl").each(
			function(i){
				if ($(this).text() == 'ISBN:'){
				  isbn = $(this)[0].nextSibling.nodeValue;
				  isbn = isbn.substr(1,13);
				}
			}
		);
		
		var url='http://210.34.4.28/api/getLOC.php?isbn='+isbn+'&title='+title;
		var port = chrome.extension.connect({name:"port"}); 
	 	port.onMessage.addListener(onMessageRecieved); 
		port.postMessage({message: url}); 
		
		function onMessageRecieved(data) { 
			addResult(data.message);
		}
		
		function addResult(arr_json){
			//alert(arr_json.marc_no);
			//alert(arr_json.title);
			if (arr_json.marc_no != ""){
					var opacLink = "http://210.34.4.28/opac/item.php?marc_no="+arr_json.marc_no;
					var htmlStr = "<h2>在哪借这本书?  ·  ·  ·  ·  ·  · </h2>";
					htmlStr += "<div class='indent'><li><a href='"+opacLink+"' target='_blank'>厦门大学图书馆馆藏</a></li>";
					if (arr_json.call_no !="")
					{	
						htmlStr += "<ul class='bs'>";
						try
						{
							for (i=0;i<arr_json.Loc_NAME.length;i++)
							{
								htmlStr += "<li style='font-size:12px'>"+arr_json.call_no+"&nbsp;&nbsp;"+arr_json.Loc_NAME[i];	
								if (arr_json.book_stat[i] == "在馆")
								{
									htmlStr += "&nbsp;&nbsp;<font color='#006600'>"+arr_json.book_stat[i]+"</font></li>";
								}							
								else
									htmlStr += "&nbsp;&nbsp;<font color='red'>"+arr_json.book_stat[i]+"</font></li>";
							} 
						}
						catch (e)
						{
						}						
						htmlStr += "</ul></div></br>";
					}
					$(".aside div:eq(0)").after(htmlStr);
			}
			else {
				var opacLink = "http://210.34.4.28/opac/openlink.php?title="+title;
				var htmlStr = "<h2>在哪借这本书?  ·  ·  ·  ·  ·  · </h2>";
				htmlStr += "<div class=indent><li><a href='"+opacLink+"' target='_blank'>厦门大学图书馆馆藏 - 查同名图书</a></li></div>";
				$(".aside div:eq(0)").after(htmlStr);
			}
		}
	}
});