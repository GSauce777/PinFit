//gonna handle saving outfits to database


// so basically, captures current outfit from workspace, sends POSt requests to server and shows notification

//function to get current outfit from workspace
function getCurrentOutfitFromWorkspace(){
    const topsSlot =document.getElementById('slot-tops');
    const bottomsSlot= document.getElementById('slot-bottoms');
    const shoesSlot =document.getElementById('slot-shoes');
    
    const topImg = topsSlot ? topsSlot.querySelector('.slotted-img'):null;
    const bottomImg = bottomsSlot ? bottomsSlot.querySelector('.slotted-img'):null;
    const shoesImg = shoesSlot ? shoesSlot.querySelector('.slotted-img'):null;
    
    return{
        top:topImg ? topImg.src: null,
        bottom:bottomImg ? bottomImg.src:null,
        shoes: shoesImg ?shoesImg.src : null
    };
}

//Function to show  notification
function showMessage(message, isError = false){

    let notification = document.querySelector('.temp-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'temp-notification';
        document.body.appendChild(notification);
        
        //adding styles for notification
        const style = document.createElement('style');
        style.textContent= `
            .temp-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                background-color: #4CAF50;
                color: white;
                border-radius: 8px;
                z-index: 10000;
                display: none;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-size: 14px;
            }
            
            .temp-notification.error {
                background-color: #f44336;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    notification.textContent=message;
    notification.className =isError ? 'temp-notification error' :'temp-notification';
    notification.style.display= 'block';
    
    setTimeout(()=>{
        notification.style.display = 'none';
    }, 3000);
}

//Save outfit function
async function saveCurrentOutfit(){
    //the outfit name from existing editable title

    const outfitTitle= document.querySelector('.outfit-title');
    const outfitName =outfitTitle ? outfitTitle.textContent.trim():'Untitled Outfit';
    
    //current outfit from workspace
    const currentOutfit=getCurrentOutfitFromWorkspace();
 
    if (!currentOutfit.top && !currentOutfit.bottom && !currentOutfit.shoes) {
        showMessage('Please add at least one clothing item to your outfit before saving!', true);
        return;
    }
    
    //user ID from hidden input
    const userIdInput = document.getElementById('currentUserId');
    const userId = userIdInput ? userIdInput.value : 1; //user id is 1 for now since we dont have any registered user
    
    try {
        const response = await fetch('/api/save-outfit',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: parseInt(userId),
                outfit_name: outfitName,
                top_image: currentOutfit.top,
                bottom_image: currentOutfit.bottom,
                shoes_image: currentOutfit.shoes
            })
        });
        
        const data =await response.json();
        
        if(data.success) {
            showMessage(`Outfit "${outfitName}" saved successfully!`);
            console.log('Outfit saved:', data);
        }else{
            showMessage(`Failed to save outfit: ${data.error || 'Unknown error'}`, true);
        }
    } catch (error) {
        console.error('Error saving outfit:', error);
        showMessage('Failed to save outfit. Make sure the server is running.', true);
    }
}

//event listener to the save button
document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.querySelector('.nav-btn[title="Save"]');
    if (saveBtn) {
        saveBtn.removeEventListener('click', saveCurrentOutfit);
        saveBtn.addEventListener('click', saveCurrentOutfit);
        console.log('Save button initialized');
    } else {
        console.warn('Save button not found');
    }
});

//keyboard shortcut Ctrl+S to save
document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveCurrentOutfit();
    }
});

