//handlees loading and dispalying saved outfits

//this fetches the saved outfits from the server and displays them in modal(which is shown when user clicks on the Myfits button)
//

//Function to load outfit into workspace
function loadOutfitToWorkspace(outfit){
    const topsSlot =document.getElementById('slot-tops');
    const bottomsSlot =document.getElementById('slot-bottoms');
    const shoesSlot =document.getElementById('slot-shoes');
    
    //function to add image to a slot
    const addImageToSlot = (slot, imageUrl)=>{
        if(!slot || !imageUrl) return;
        
        const label = slot.querySelector('.slot-label');
        if(label) label.style.display = 'none';
        
        //checks if an image already exists in this slot
        let existingImg =slot.querySelector('.slotted-img');
        
        //If it dosnt exist,creates new image
        if(!existingImg) {
            existingImg = document.createElement('img');
            existingImg.classList.add('slotted-img');
            slot.appendChild(existingImg);
        }
        existingImg.src = imageUrl;
        
        //clear button if not exists
        let clearBtn = slot.querySelector('.clear-btn');
        if (!clearBtn) {
            clearBtn = document.createElement('button');
            clearBtn.classList.add('clear-btn');
            clearBtn.textContent = '✕';
            clearBtn.title = "Clear slot";
            
            clearBtn.addEventListener('click', () => {
                existingImg.remove();
                clearBtn.remove();
                if (label) label.style.display = 'block';
            });
            
            slot.appendChild(clearBtn);
        }
    };
    
    //clear existing images from all slots
    [topsSlot, bottomsSlot, shoesSlot].forEach(slot =>{
        const existingImg =slot.querySelector('.slotted-img');
        const clearBtn =slot.querySelector('.clear-btn');
        const label =slot.querySelector('.slot-label');
        
        if (existingImg) existingImg.remove();
        if (clearBtn) clearBtn.remove();
        if (label) label.style.display = 'block';
    });
    
    //Add images to slots
    addImageToSlot(topsSlot, outfit.top_image_url);
    addImageToSlot(bottomsSlot, outfit.bottom_image_url);
    addImageToSlot(shoesSlot, outfit.shoes_image_url);
    
    //Update outfit name
    const outfitTitle = document.querySelector('.outfit-title');
    if (outfitTitle) {
        outfitTitle.textContent = outfit.outfit_name;
    }
    
    //success message
    showMessage(`Loaded outfit: ${outfit.outfit_name}`);
}

//deletes outfit function
function deleteOutfit(outfitId){
    if(!confirm('Are you sure you want to delete this outfit?')) return;
    try{
        const stored = localStorage.getItem('pinfit_outfits');
        const outfits = stored ? JSON.parse(stored) : [];
        const filtered = outfits.filter(o => o.id !== outfitId);
        localStorage.setItem('pinfit_outfits', JSON.stringify(filtered));
        showMessage('Outfit deleted successfully!');
        loadSavedOutfits();
    } catch(error) {
        console.error('Error deleting outfit:', error);
        showMessage('Failed to delete outfit', true);
    }
}

// Display saved outfits in modal
function displaySavedOutfits(outfits){
    const savedOutfitsList = document.getElementById('savedOutfitsList');
    if (!savedOutfitsList) return;
    
    savedOutfitsList.innerHTML = '';
    
    if(outfits.length === 0) {
        savedOutfitsList.innerHTML = '<div class="no-outfits">No saved outfits yet. Start creating!</div>';
        return;
    }
    
    outfits.forEach(outfit=>{
        const outfitCard = document.createElement('div');
        outfitCard.classList.add('outfit-card');

        const date = new Date(outfit.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        outfitCard.innerHTML = `
            <div class="outfit-card-header">
                <h3>${escapeHtml(outfit.outfit_name)}</h3>
            </div>
            <div class="outfit-images-preview">
                ${outfit.top_image_url ? `<img src="${outfit.top_image_url}" class="preview-image" alt="Top">` 
                    : '<div class="empty-preview">No Top</div>'}
                ${outfit.bottom_image_url 
                    ? `<img src="${outfit.bottom_image_url}" class="preview-image" alt="Bottom">` 
                    : '<div class="empty-preview">No Bottom</div>'}
                ${outfit.shoes_image_url 
                    ? `<img src="${outfit.shoes_image_url}" class="preview-image" alt="Shoes">` 
                    : '<div class="empty-preview">No Shoes</div>'}
            </div>
            <div class="outfit-card-footer">
                <span>${date}</span>
                <div>
                    <button class="load-outfit-btn" data-id="${outfit.id}">Load</button>
                    <button class="delete-outfit-btn" data-id="${outfit.id}">Delete</button>
                </div>
            </div>`;
        
//load functionality
        const loadBtn = outfitCard.querySelector('.load-outfit-btn');
        loadBtn.addEventListener('click', (e)=>{
            e.stopPropagation();
            loadOutfitToWorkspace(outfit);
            const modal = document.getElementById('savedOutfitsModal');
            if (modal) modal.style.display = 'none';
        });
        
        //add delete functionality
        const deleteBtn =outfitCard.querySelector('.delete-outfit-btn');
        deleteBtn.addEventListener('click',(e)=>{
            e.stopPropagation();
            deleteOutfit(outfit.id);
        });
        
        savedOutfitsList.appendChild(outfitCard);
    });
}

//Load saved outfits from server
function loadSavedOutfits() {
    const savedOutfitsList = document.getElementById('savedOutfitsList');
    if (!savedOutfitsList) return;

    savedOutfitsList.innerHTML = '<div class="loading-text">Loading your outfits...</div>';

    try {
        const stored = localStorage.getItem('pinfit_outfits');
        const outfits = stored ? JSON.parse(stored) : [];
        displaySavedOutfits(outfits);
    } catch (error) {
        console.error('Error loading outfits:', error);
        savedOutfitsList.innerHTML = '<div class="no-outfits">Failed to load outfits.</div>';
    }

    const modal = document.getElementById('savedOutfitsModal');
    if (modal) modal.style.display = 'block';
}

//Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

//load functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    //event listener to My Fits button
    const myFitsBtn = document.querySelector('.nav-btn[title="My Fits"]');
    if (myFitsBtn) {
        myFitsBtn.removeEventListener('click', loadSavedOutfits);
        myFitsBtn.addEventListener('click', loadSavedOutfits);
        console.log('My Fits button initialized');
    }
    
    //close functionality
    const modal = document.getElementById('savedOutfitsModal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }
    
    //closes modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});