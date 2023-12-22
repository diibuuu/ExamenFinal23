//Déclarer la constante pour le regex
const nomregex = /^[a-zA-Z]{3,}$/

//Cacher les messages d'erreur
let $nomcheck = $("#nomcheck");
let $ingredient1check = $("#ingredient1check");
let $quantite1check = $("#quantite1check");
let $ingredient2check = $("#ingredient2check");
let $quantite2check = $("#quantite2check");
let $quantite3check = $("#quantite3check");
let $quantite4check = $("#quantite4check");
let $quantite5check = $("#quantite5check");
let $instructioncheck = $("#instructionscheck");

$nomcheck.hide();
$ingredient1check.hide();
$quantite1check.hide();
$ingredient2check.hide();
$quantite2check.hide();
$quantite3check.hide();
$quantite4check.hide();
$quantite5check.hide();
$instructioncheck.hide();

// Façon JQuery de recuperer les données et utiliser la classe creerRecette() pour les afficher dans la page
$.getJSON('https://6585925d022766bcb8c8e931.mockapi.io/api/recettes/recettes')
    .done(function (recettes){
        recettes.forEach(function (recette){
            creerRecette(recette);
        });
    })
    .fail(function (error){
        $('.alert').text(error.status).removeClass('d-none');
    });

/*Fonction pour créer et afficher la recette dans la colonne des recettes
* return : List item*/
function creerRecette(recette){
    $("#recettes").append(`
    <li class="list-group-item">
    Nom de la recette: ${recette.nom} <br>
    Ingrédients: <br>
    ${recette.ingredient1}  ${recette.qte1} <br>
    ${recette.ingredient2}  ${recette.qte2} <br>
    ${recette.ingredient3}  ${recette.qte3} <br>
    ${recette.ingredient4}  ${recette.qte4} <br>
    ${recette.ingredient5}  ${recette.qte5} <br>
    Instructions: ${recette.instructions}
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
    <button type="button" onclick="delRecette(${recette.id})" id="delrecette-${recette.id}" class="btn btn-danger">Supprimer</button>
</div>
    
</li>
    `);
}

/*Fonction pour vérifier si le nom entré dans le formulaire est conforme aux conditions
* return : bool*/
function validerNom(){
    if(nomregex.test($("[name = 'nom']").val())){
        $nomcheck.hide();
        return true;
    }
    else {
        $nomcheck.show();
    }
}

/*Fonction pour vérifier si le input ingrédient entré est vide ou non
* return : bool*/
function validerIngredient1(){
    if ($("[name = 'ingredient1']").val()){
        $ingredient1check.hide();
        return true;
    }
    else {
        $ingredient1check.show();

    }
}

/*Fonction pour vérifier si la quantité entrée est vide ou non
* return : bool*/
function validerQte1(){
    const $qte1 = $("[name = 'qte1']").val();
    if($qte1.trim() === '' || $qte1 < 1){
        $quantite1check.show();
    }
    else{
        $quantite1check.hide();
        return true
    }
}

/*Fonction pour vérifier si le input ingrédient entré est vide ou non
* return : bool*/
function validerIngredient2(){
    if ($("[name = 'ingredient2']").val()){
        $ingredient2check.hide();
        return true;
    }
    else {
        $ingredient2check.show();

    }
}

/*Fonction pour vérifier si la quantité entrée est vide ou non
* return : bool*/
function validerQte2(){
    const $qte2 = $("[name = 'qte2']").val();
    if($qte2.trim() === '' || $qte2 < 1){
        $quantite2check.show();
    }
    else{
        $quantite2check.hide();
        return true
    }
}


$(document).ready(function (){
    $("#soumettreRecette").click((function (){  //Lorsque on click sur le boutton Soumettre
        if (validerNom() && validerQte1() && validerIngredient1() && validerIngredient2() && validerQte2() === true){ // Appel aux validations
            let nomRecette = $("#nom").val();
            let ingredient1 = $("#ingredient1").val();
            let qte1 = $("#qte1").val();
            let ingredient2 = $("#ingredient2").val();
            let qte2 = $("#qte2").val();

            let ingredient3 = $("#ingredient3").val(); // Les ingredients et qte 3, 4 et 5 sont optionels
            let qte3 = $("#qte3").val();
            if (ingredient3 || qte3 === null){
                ingredient3 = "";
                qte3 = "";
            }
            let ingredient4 = $("#ingredient4").val();
            let qte4 = $("#qte4").val();
            if (ingredient4 || qte4 === null){
                ingredient4 = "";
                qte4 = "";
            }
            let ingredient5 = $("#ingredient5").val();
            let qte5 = $("#qte5").val();
            if (ingredient5 || qte5 === null){
                ingredient5 = "";
                qte5 = "";
            }
            let instructions = $("#instructions").val();

            let nouvelleRecette = { // Création de la récette dans une variable
                "nom": nomRecette,
                "ingredient1": ingredient1,
                "qte1": qte1,
                "ingredient2": ingredient2,
                "qte2": qte2,
                "ingredient3": ingredient3,
                "qte3": qte3,
                "ingredient4": ingredient4,
                "qte4": qte4,
                "ingredient5": ingredient5,
                "qte5": qte5,
                "instructions": instructions
            }
            // On utilise la façon fetch pour ajouter des nouvelles recettes
            fetch('https://6585925d022766bcb8c8e931.mockapi.io/api/recettes/recettes',{
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(nouvelleRecette), // On utilise JSON.stringify pour ajouter la nouvelle recette dans le array JSON
            })
                //Gerer des erreurs
                .then(reponse=>{
                    if (!reponse.ok) {
                        throw new Error(`Erreur: ${reponse.status}`);
                    }
                    return reponse.json();
                })
                .then(data => {
                    console.log('Recette ajoutée avec success:', data);
                })
                .catch(error => {
                    console.error('Erreur pour ajouter!', error);
                });

        }
    }))
})

/*
Function delRecette pour supprimer des recettes à partir de leur id
 */
function delRecette(id){
    fetch(`https://6585925d022766bcb8c8e931.mockapi.io/api/recettes/recettes/` + id, { // On ajoute le id à la fin pour trouver l'objet qu'on veut supprimer
        method: 'DELETE',
        // Gestion d'erreurs
    }).then(reponse => {
        if (reponse.ok) {
            throw new Error(`Erreur: ${reponse.status}`);
        }
        return reponse.json();
    }).then(data => {

        console.log('Recette:', data);
    }).catch(error => {
        console.error('Recette Supprimée', error);
    })
}


/*Fonction pour eviter que les données soient effacées aprés la soumission du formulaire*/
$("#form").submit(function(e){
    e.preventDefault();
});
