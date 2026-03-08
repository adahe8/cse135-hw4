// Form handling
const echoform = document.getElementById('echo-form');
const endpoints = {
    'PHP': '/cgi-bin/echo-php.php',
    'Ruby': '/cgi-bin/echo-ruby.rb',
    'Python': '/cgi-bin/echo-python.py'
}

echoform.addEventListener('submit', sendRequest);

function sendRequest(event){
    event.preventDefault();

    const encodeAsJSON = document.querySelector('input[name="json"]').checked;
    let selectedLang = document.getElementById('scripting-lang').value;
    let selectedMethod = document.getElementById('http-method').value;
    document.getElementById('override').value = selectedMethod;
    const data = getFormData(echoform);
    
    const action = endpoints[selectedLang];
    if (!action) throw new Error('Invalid language selected! Please stick to the original dropdown options.');

    if (selectedMethod === 'PUT' || selectedMethod === 'DELETE') {
        echoform.method = 'POST';
    } else if (selectedMethod === 'GET' || selectedMethod === 'POST'){
        echoform.method = selectedMethod;
    } else {
         throw new Error('Invalid request type! Please stick to the original dropdown options.');
    }
    echoform.action = action;
    
    if (encodeAsJSON) {
        fetch(echoform.action, {
            method: (selectedMethod === 'PUT' || selectedMethod === 'DELETE') ? 'POST' : selectedMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: (selectedMethod === 'GET') ? undefined : JSON.stringify(data)
        })
        .then(response => response.text())
        .then(html => {
            // Display or process the JSON response
            document.getElementById('results').innerHTML = html;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        echoform.submit();
    }
}

function getFormData(form){
    return Object.fromEntries(new FormData(form).entries());
}

const bookform = document.getElementById('book-form');
echoform.addEventListener('submit', echoData);
const cover = document.getElementById('cover');
const title = document.getElementById('booktitle');
const genres = document.getElementById('genres');

function echoData(event){
    event.preventDefault();
    
    const formData = new FormData(bookform);
    title.innerHTML = formData.get('book');
    genres.innerHTML = formData.getAll('genre').join(', ');
    cover.style.backgroundColor = "lightblue";
}