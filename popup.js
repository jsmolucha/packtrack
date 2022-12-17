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
            
            emptySetError();
            
        } else {

            //if there is a tracking number, proceed to the following code.
            const e = document.createElement('div')

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

            addPackageConfirm()

            //document.body.appendChild(e)

            document.getElementById('tracking').value = '';
            const errorMsg = document.getElementById('error')
            errorMsg?.remove();
             
        }

    });

    function emptySetError() {
        const c = document.createElement('p')

            //creating a new error object, probably a better way to do this honestly. 
            c.setAttribute('id', 'error')
            c.innerHTML = "Please enter valid tracking #"
            const dom = document.getElementById('msgCode')
            dom.append(c)

            setTimeout(function() {c.remove()}, 3000)
    }

    function addPackageConfirm() {
        const c = document.createElement('p')

            //creating a new error object, probably a better way to do this honestly. 
            c.setAttribute('id', 'addSuccess')
            c.innerHTML = "Successfully added"
            const dom = document.getElementById('msgCode')
            dom.append(c)

            setTimeout(function() {c.remove()}, 3000)

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
        
        let promise = new Promise((resolve) => {
            //set promise to finish the function and load all the DOM elements
            chrome.storage.sync.get(['packages']).then((result) => {
                console.log(result.packages)
                
                for (i =0; i < result.packages.length; i++) {
                
                    const e = document.createElement('div')
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
                //resolve promise here 
                resolve("true")
            })
        })
        //catch the promise and call the newDelete function to load delete functionality to the delete buttons
        await promise;
        console.log(promise)

        newDelete()
    }

    function newDelete() {

        var trash = [

        ]

        const deleteButton = document.getElementsByClassName('deletePkg')

        for(let i=0; i < deleteButton.length; i++) {
            deleteButton[i].addEventListener('click', function() {
                let markedForDelete = document.getElementById(this.value) 
                console.log(this.value)
                markedForDelete.remove();
                console.log("removed button id: " + this.value)

                var deleteThis = this.value
                
                for (let i=0; i < data.length; i++) {
                    if(data[i].pkgId == deleteThis) {

                        console.log("delete item at index: " + i)
                        let index = i

                        var old = data
                        console.log("before splice: " + old)
                    
                        old.splice(index, 1)
                        console.log("After splice: " + old)
                    }
                }
                //thought process here 
                //made a temporary array that would hold the new array mof objects pushed any time the delete button is pressed
                trash.push(old)
                //call the function to clear the local chrome storage
                clearArray();
                //set the now empty storage to the new values based off the trash that was set. 
                //this actually works reliably since the chrome storage sync overwrites changes.
                chrome.storage.sync.set({'packages': trash[0] }).then(() => {
                    console.log("Value is set to " + trash[0]);

                })
            })
        }
    }
}); 
// end DOM function


   

