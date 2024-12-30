const api = `https://jsonplaceholder.typicode.com/posts?_limit=3`; 
const postForm = document.getElementById('postForm')  
const titleInput = document.getElementById('titleInput') 
const bodyInput = document.getElementById('bodyInput')  
const postList = document.querySelector('#postList')  
let posts = [];  
  
async function getData() {  
    try {  
        const response = await fetch(api)  
        console.log(response)  
        if (!response.ok) {  
            throw new Error('Помилка статусу : ', response.status)  
        }  
        posts = await response.json()  
        console.log(posts)  
        showData()  
    } catch (err) {  
        console.log(err)  
    }  
}  
getData()  
  
function showData() {  
    postList.innerHTML = "";  
    posts.forEach((post) => {  
        const li = document.createElement('li');  
        li.dataset.id = post.id;  
        li.innerHTML = `  
    <h3>${post.title}</h3>  
    <p>${post.body}</p>  
    <button class="editBtn">Edit</button>  
    <button class="deleteBtn">Delete</button>  
    `;  
        postList.appendChild(li)  
    })  
}  
  
postForm.addEventListener('submit', async (e) => {  
    e.preventDefault()  
    const inputValues = {  
        title: titleInput.value,  
        body: bodyInput.value  
    }   
    try {  
        const response = await fetch(api, {  
            method: "POST",  
            headers: { "Content-Type": "application/json" },  
            body: JSON.stringify(inputValues)  
        })  
        let newPost = await response.json()  
        posts = [newPost, ...posts]  
        showData()  
    } catch (err) {  
        console.log(err)  
    }  
      
})  
postList.addEventListener('click', (event) => {  
const postId = event.target.closest('li')?.dataset.id 
if(event.target.classList.contains('editBtn')) { 
    editButton(postId) 
} 
})  
 
function editButton(id){  
    console.log('edit'); 
    const findPost = posts.find((post) => post.id===+id); 
    if(findPost) { 
        titleInput.value  = findPost.title; 
        bodyInput.value = findPost.body 
        postForm.onsubmit = async(e) => {
            e.preventDefault()
            findPost.title = titleInput.value;
            findPost.body = bodyInput.value;
            try{
                await fetch(`${api}/${id}`,{
                    method:'PATCH',
                    headers: { "Content-Type": "application/json" },  
                    body: JSON.stringify(findPost),
                    
                })
                showData()
                postForm.onsubmit = addpost; // Прописати функцію addpost
                
            }catch(err){
                console.log(err);
                
            }
        }
    } 
}