document.addEventListener('DOMContentLoaded', function() {

    performSync();

    var data = [

    ]

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
            const e = document.createElement('button')

            function newPackId() {
                return(Math.floor(Math.random() * 10000 + 1))
            }
            
            e.setAttribute('class', 'pkgTrack')
            e.setAttribute('id', `${newPackId()}`)

            let tracking = document.getElementById('tracking').value
            let courier = document.getElementById('couriers').value

            e.innerHTML = `<img src='img/${courier}.svg' id='courierIcon'>` + '<br>' + `${tracking}` + '<br>' + '<button class="deletePkg">Delete</button>'
            
            data.push({
                "pkgId": `${e.getAttribute('id')}`,
                "logo": `${courier}.svg`,
                "trackingNum": `${tracking}`

            })

            chrome.storage.sync.set({'packages': data }).then(() => {

                console.log("Value is set to " + data);

              })
           
            document.getElementById('packages').append(e)
            //document.body.appendChild(e)

            document.getElementById('tracking').value = '';
            const errorMsg = document.getElementById('error')
            errorMsg?.remove();
             
        }

    });

    const isLoaded = async selector => {
        while (document.querySelector(selector) === null) {
            await new Promise (resolve => requestAnimationFrame(resolve)) 
        }
        return document.querySelector(selector)
    }

    function clearArray() {

        chrome.storage.sync.clear(function() {
            var error = chrome.runtime.lastError;
            if(error) {
                console.error(error)
            }
        })
    }

    async function performSync() {
        //this is where the data is loaded from local storage and put into the DOM
        //this function also moves the updated items into an array so that -
        // - it is loaded into the DOM upon refresh.
        //end function for data retrieval and storage loading
        let promise = new Promise((resolve) => {
            chrome.storage.sync.get(['packages']).then((result) => {
                console.log(result.packages)
                
                for (i =0; i < result.packages.length; i++) {
                
                    const e = document.createElement('button')
                    e.setAttribute('class', 'pkgTrack')

                    let tracking = result.packages[i].trackingNum
                    let courier = result.packages[i].logo

                    e.setAttribute('id', result.packages[i].pkgId)

                    e.innerHTML = `<img src='img/${courier}' id='courierIcon'> <br> ${tracking} <br> <button value=${result.packages[i].pkgId} class="deletePkg">Delete</button>`
                    document.getElementById('packages').append(e)

                    data.push({
                        "pkgId":result.packages[i].pkgId,
                        "logo":result.packages[i].logo,
                        "trackingNum":result.packages[i].trackingNum
                    
                    })

                }

                resolve("true")
            })
        })

        await promise;
        console.log(promise)

        newDelete()
    }

    function newDelete() {

        const deleteButton = document.getElementsByClassName('deletePkg')

        for(let i=0; i < deleteButton.length; i++) {
            deleteButton[i].addEventListener('click', function() {
                console.log(this.value)
                let markedForDelete = document.getElementById(this.value) 
                markedForDelete.remove();
                console.log("removed button id: " + this.value)
            })
        }
        
    }

    ///
    /* isLoaded('#deletePkg').then((selector) => {

        console.log("element is ready")
        console.log(selector)

        var deletePkgBtn = document.querySelectorAll('#deletePkg');
        
        deletePkgBtn.forEach(function (i) {
            i.addEventListener('click', function() {
                console.log("works" + this.value)
                let markedForDelete = document.getElementById(this.value) 
                markedForDelete.remove()

                var deleteThis = this.value

                for (let i =0; i < data.length; i++) {
                    if(data[i].pkgId == deleteThis) {
                        console.log("delete item at " + i)
                        let index = i
                        var curArr = data
                        //sanity checks, ignore this lol
                        console.log("old arr: " + curArr)
                        //this splice method works *reliably*
                        curArr.splice(index,1)

                        console.log(curArr)
                        //testing clearing from the local storage

                        

                    }
                } 
            })
            
        })
        
    }) */ 
}); 
// end DOM function


   

