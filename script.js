
// Configurer Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC1neYYurBkDaIQH3Y6lXafrWlbclm-shg",
    authDomain: "gestion-reseau-te64.firebaseapp.com",
    databaseURL: "https://gestion-reseau-te64-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gestion-reseau-te64",
    storageBucket: "gestion-reseau-te64.appspot.com",
    messagingSenderId: "948884655120",
    appId: "1:948884655120:web:b773606a1b107ec4314e95",
    measurementId: "G-FTVWX8TC39"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

const loginContainer = document.getElementById('login-container');
const formContainer = document.getElementById('form-container');
const adminContainer = document.getElementById('admin-container');
const loginButton = document.getElementById('login');
const workForm = document.getElementById('work-form');
const createUserForm = document.getElementById('create-user-form');

// Authentification
loginButton.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
            loginContainer.style.display = 'none';
            formContainer.style.display = 'block';
            // Afficher le formulaire de création d'utilisateur pour l'administrateur
            if (email === 'q.humarque@te64.fr') {  // Remplacez par l'email de l'administrateur
                adminContainer.style.display = 'block';
            }
        })
        .catch(error => {
            alert(error.message);
        });
});

// Soumettre le formulaire de travaux
workForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const company = document.getElementById('company').value;
    const commune = document.getElementById('commune').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const workType = document.getElementById('work-type').value;
    const siteManager = document.getElementById('site-manager').value;
    const boxNumber = document.getElementById('box-number').value;

    const userId = auth.currentUser.uid;

    const workData = {
        company,
        commune,
        startDate,
        endDate,
        workType,
        siteManager,
        boxNumber,
        userId,
        status: 'in progress'
    };

    db.ref('works').push(workData).then(() => {
        alert('Données soumises avec succès');
    }).catch((error) => {
        alert(error.message);
    });
});

// Fonction pour créer un nouvel utilisateur
function createUser(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Utilisateur créé avec succès:', user);
        })
        .catch((error) => {
            console.error('Erreur lors de la création de l\'utilisateur:', error.message);
        });
}

// Gérer la soumission du formulaire de création d'utilisateur
createUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    createUser(email, password);
});

// Afficher le calendrier et la carte
function loadCalendarAndMap() {
    // Charger les données et afficher le calendrier
    db.ref('works').on('value', (snapshot) => {
        const works = snapshot.val();
        // Code pour afficher les travaux dans le calendrier
    });

    // Charger la carte
    const map = L.map('map').setView([46.603354, 1.888334], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Charger les données de coffrets de commande
    db.ref('coffrets').on('value', (snapshot) => {
        const coffrets = snapshot.val();
        for (let key in coffrets) {
            const coffret = coffrets[key];
            L.marker([coffret.lat, coffret.lng])
                .addTo(map)
                .bindPopup(`<b>Commune:</b> ${coffret.commune}<br><b>N° de coffret:</b> ${coffret.boxNumber}`);
        }
    });
}

// Écouter l'authentification de l'utilisateur
auth.onAuthStateChanged((user) => {
    if (user) {
        loadCalendarAndMap();
    }
});