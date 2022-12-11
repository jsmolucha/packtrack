document.addEventListener('DOMContentLoaded', function() {
    var newPkgBtn = document.getElementById('newPkg');
    
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
            console.log('button was pressed.')

            const e = document.createElement('button')

            e.setAttribute('id', 'pkgTrack')

            let tracking = document.getElementById('tracking').value
            let courier = document.getElementById('couriers').value

            e.innerHTML = `<img src='img/${courier}.svg' id='courierIcon'>` + '<br>' + `${tracking}`
       
            document.body.appendChild(e)

            document.getElementById('tracking').value = '';
            const errorMsg = document.getElementById('error')
            errorMsg?.remove();

            //putting all objects into an array that we can save to local chrome storage
            //making a child object to find via the query selector
            const child = document.querySelectorAll('button#pkgTrack')
            //push all found new package queries to the array called packageArray
            const packageArray = Array.from(child)

            console.log(packageArray)
            
            chrome.storage.local.set({'storedArray':packageArray}, function() {
                console.log(`storeArray now contains ${packageArray.length} objects`)
                //then you just access the JSON objects as you normally would in an array
                console.log(packageArray[0].innerHTML)
            })


        }

        
    });

    ///write code for deleting the instance right here. 
});
