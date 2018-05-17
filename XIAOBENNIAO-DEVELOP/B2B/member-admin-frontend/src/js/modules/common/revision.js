//获取 model&modules 的版本
!function loadRevision() {
    var url = '../../../rev/manifest.json'
    try {
	    X.require.revision = JSON.parse(X.syncRequest(url))
	} catch(e) {
		
	}
}()