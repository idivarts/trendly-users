import React from 'react'

const DownloadApp = () => {
    const htmlScript = `<script>
!function(t,e,n,s,a,c,i,o,p){t.AppsFlyerSdkObject=a,t.AF=t.AF||function(){(t.AF.q=t.AF.q||[]).push([Date.now()].concat(Array.prototype.slice.call(arguments)))},t.AF.id=t.AF.id||i,t.AF.plugins={},o=e.createElement(n),p=e.getElementsByTagName(n)[0],o.async=1,o.src="https://websdk.appsflyer.com?"+(c.length>0?"st="+c.split(",").sort().join(",")+"&":"")+(i.length>0?"af_id="+i:""),p.parentNode.insertBefore(o,p)}(window,document,"script",0,"AF","banners",{banners: {key: "96dbde7e-aaff-40e3-bb17-e99f631fc059"}});
AF('banners', 'showBanner')
</script>`

    return (
        <div dangerouslySetInnerHTML={{ __html: htmlScript }} />
    )
}

export default DownloadApp 