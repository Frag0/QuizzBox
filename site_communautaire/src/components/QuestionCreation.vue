<template>
	<div class="row">
		<div v-bind:class="classalert" v-if="message != ''">{{message}}</div>
		<form class="col s12" @submit="creerQuestion">
			<div cla0ss="row">
				<label> Vos quizz</label>
				<select id="quizz" v-model="quizz" class="browser-default col s12">
					<option v-if="quizz.id_createur == $store.state.member.id" v-for="quizz in quizzs" v-bind:value="quizz.id">{{quizz.nom}}</option>
				</select>
			</div>
			<div class="row">
				<div class="input-field col s12">
					<input id="intitule" v-model="intitule" type="text" class="validate">
					<label for="intitule">Intitulé</label>
				</div>
			</div>
			<div class="row">
				<div class="input-field col s6">
					<input id="reponse1" v-model="reponse1" type="text" class="validate">
					<label for="reponse1">Réponse 1</label>
				</div>
				<div class="input-field col s6">
					<input id="reponse2" v-model="reponse2" type="text" class="validate">
					<label for="reponse2">Réponse 2</label>
				</div>
			</div>
			<div class="row">
				<div class="input-field col s6">
					<input id="reponse3" v-model="reponse3" type="text" class="validate">
					<label for="reponse3">Réponse 3</label>
				</div>
				<div class="input-field col s6">
					<input id="reponse4" v-model="reponse4" type="text" class="validate">
					<label for="reponse4">Réponse 4</label>
				</div>
			</div>
			<div class="row">
				<h6> Cochez la bonne réponse : </h6>
				<p>
					<input type="radio" id="checkReponse1" value="0" v-model="picked"/>
					<label for="checkReponse1">Réponse 1</label>
				</p>
				<p>
					<input type="radio" id="checkReponse2" value="1" v-model="picked"/>
					<label for="checkReponse2">Réponse 2</label>
				</p>
				<p>
					<input type="radio" id="checkReponse3" value="2" v-model="picked"/>
					<label for="checkReponse3">Réponse 3</label>
				</p>
				<p>
					<input type="radio" id="checkReponse4" value="3" v-model="picked"/>
					<label for="checkReponse4">Réponse 4</label>
				</p>
			</div>
			<div class="row">
				<button class="btn-large waves-effect waves-light col s4 offset-s4" type="submit">Créer !
					<i class="material-icons right">send</i>
				</button>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	name: 'QuestionCreation',
	data () {
		return {
			intitule: '',
			reponse1: '',
			reponse2: '',
			reponse3: '',
			reponse4: '',
			picked: '',
			quizz: '',
			quizzs: [],
			message: '',
			classalert:''
		}
	},
	mounted () {
		window.axios.get('quizz').then(response => { 
			this.quizzs = response.data.quizz
		})
	},
	methods: {
		creerQuestion(){
			let message = ''
			if (this.quizz == '') {
				message+="Veuillez choisir un quizz. "
			}
			if (this.intitule == '') {
				message+="Veuillez remplir l'intitulé. "
			}
			if (this.reponse1 == '' || this.reponse2 == '' || this.reponse3 == '' || this.reponse4 == '') {
				message+="Veuillez remplir toutes les réponses. "
			}
			if (this.picked == '') {
				message+="Veuillez cocher la bonne réponse. "
			}

			if (message != '') {
				this.message = message
				this.classalert="card-panel red lighten-2"
			}
			else {

				window.axios.post('question', {
					intitule: this.intitule,
					id_quizz: this.quizz,
				}, {headers:  {'Authorization': 'Bearer ' + this.$store.state.member.token }}).then(response => {
					
					window.axios.post('reponses', {

					reponses: [this.reponse1, this.reponse2, this.reponse3, this.reponse4],
					picked: this.picked,
					id_question: response.data.question.id,
					}, {headers:  {'Authorization': 'Bearer ' + this.$store.state.member.token }}).then(response => {
						this.$router.push({path: '/question-creation'});
						this.intitule=''
						this.reponse1=''
						this.reponse2=''
						this.reponse3=''
						this.reponse4=''
						this.picked=''
						this.message='La question a bien été créée !'
						this.classalert="card-panel green lighten-2"
				})
				})
			}
		}
	}
}
</script>

<style scoped>
</style>