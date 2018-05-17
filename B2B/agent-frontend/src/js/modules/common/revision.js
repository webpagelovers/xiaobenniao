//获取 model&modules 的版本
!function loadRevision() {
    var url = '../../../rev/manifest.json'
    try {
	    X.require.revision = JSON.parse(X.syncRequest(url))
	} catch(e) {

	}
}()

//为了方便，剩的在所以页面都写analytics.js, 就将百度统计写在revision中
 ;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-100335941-1', 'auto')
  ga('send', 'pageview')