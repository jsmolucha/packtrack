document.addEventListener('DOMContentLoaded', function() {

    var data = {
        "packages": [

        ]
    }

    var newPkgBtn = document.getElementById('newPkg');
    var savePkgBtn = document.getElementById('savePkg')

    ///////this code is for adding and checking tracking number
    newPkgBtn.addEventListener('click', function () {

        //this function checks if the user put a tracking number
        //check if value is null or empty
        if (document.getElementById('tracking').value == '') {
            const c = document.createElement('p')

            //creating a new error object, probably a better way to do this honestly. 
            c.setAttribute('id', 'error')
            c.innerHTML = "Please enter valid tracking #"
            const dom = document.getElementById('msgCode')
            dom.append(c)
            
        } else {
            //if there is a tracking number, proceed to the following code.

            const e = document.createElement('button')

            e.setAttribute('id', 'pkgTrack')

            let tracking = document.getElementById('tracking').value
            let courier = document.getElementById('couriers').value

            e.innerHTML = `<img src='img/${courier}.svg' id='courierIcon'>` + '<br>' + `${tracking}`
            
            data.packages.push({
                "pkgId": Math.floor(Math.random() * 1000 + 1),
                "logo": `${courier}.svg`,
                "trackingNum": `${tracking}`
            })

            chrome.storage.sync.set({'test':data}, function() {
                //console.log(`storeArray now contains ${packageArray.length} objects`)
                //then you just access the JSON objects as you normally would in an array
               console.log(data)
           })

            document.body.appendChild(e)

            document.getElementById('tracking').value = '';
            const errorMsg = document.getElementById('error')
            errorMsg?.remove();
             
        }

    });
       
    //this is where the data is loaded from local storage and offloaded into the DOM. 
    chrome.storage.sync.get('test', function(result) {
        console.log(result.test.packages)

        for (i =0; i < result.test.packages.length; i++) {
        
            const e = document.createElement('button')
            e.setAttribute('id', 'pkgTrack')
            let tracking = result.test.packages[i].trackingNum
            let courier = result.test.packages[i].logo
            e.innerHTML = `<img src='img/${courier}' id='courierIcon'>` + '<br>' + `${tracking}`
            document.body.appendChild(e)

            data.packages.push({
                "pkgId":result.test.packages[i].pkgId,
                "logo":result.test.packages[i].logo,
                "trackingNum":result.test.packages[i].trackingNum
    
            });

        };

    });

});
