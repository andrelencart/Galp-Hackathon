from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)

users = []

COUNTRIES_AND_DISTRICTS = {

	"Portugal": {
		"Aveiro": ["Aveiro", "Espinho", "Santa Maria da Feira", "Oliveira de Azeméis", "Ílhavo", "Águeda", "Anadia", "Arouca", "Castelo de Paiva", "Estarreja", "Mealhada", "Murtosa", "Ovar", "São João da Madeira", "Sever do Vouga", "Vagos", "Vale de Cambra"],
		"Beja": ["Beja", "Aljustrel", "Moura", "Serpa", "Almodôvar", "Alvito", "Barrancos", "Castro Verde", "Cuba", "Ferreira do Alentejo", "Mértola", "Odemira", "Ourique", "Vidigueira"],
		"Braga": ["Braga", "Guimarães", "Vila Nova de Famalicão", "Barcelos", "Amares", "Cabeceiras de Basto", "Celorico de Basto", "Esposende", "Fafe", "Póvoa de Lanhoso", "Terras de Bouro", "Vieira do Minho", "Vila Verde", "Vizela"],
		"Bragança": ["Bragança", "Mirandela", "Macedo de Cavaleiros", "Vinhais", "Alfândega da Fé", "Carrazeda de Ansiães", "Freixo de Espada à Cinta", "Mogadouro", "Torre de Moncorvo", "Vila Flor", "Miranda do Douro"],
		"Castelo Branco": ["Castelo Branco", "Covilhã", "Fundão", "Sertã", "Belmonte", "Idanha-a-Nova", "Oleiros", "Penamacor", "Proença-a-Nova", "Vila de Rei", "Vila Velha de Ródão"],
		"Coimbra": ["Coimbra", "Figueira da Foz", "Cantanhede", "Lousã", "Arganil", "Góis", "Mealhada", "Mira", "Miranda do Corvo", "Montemor-o-Velho", "Oliveira do Hospital", "Pampilhosa da Serra", "Penacova", "Penela", "Soure", "Tábua", "Vila Nova de Poiares"],
		"Évora": ["Évora", "Montemor-o-Novo", "Estremoz", "Reguengos de Monsaraz", "Alandroal", "Arraiolos", "Borba", "Moura", "Mora", "Redondo", "Vendas Novas", "Viana do Alentejo", "Vila Viçosa"],
		"Faro": ["Faro", "Albufeira", "Loulé", "Portimão", "Alcoutim", "Castro Marim", "Lagoa", "Lagos", "Monchique", "Olhão", "São Brás de Alportel", "Silves", "Tavira", "Vila do Bispo", "Vila Real de Santo António"],
		"Guarda": ["Guarda", "Seia", "Gouveia", "Pinhel", "Aguiar da Beira", "Almeida", "Celorico da Beira", "Figueira de Castelo Rodrigo", "Fornos de Algodres", "Manteigas", "Mêda", "Sabugal", "Trancoso", "Vila Nova de Foz Côa"],
		"Leiria": ["Leiria", "Marinha Grande", "Caldas da Rainha", "Pombal", "Alcobaça", "Alvaiázere", "Ansião", "Batalha", "Bombarral", "Castanheira de Pera", "Figueiró dos Vinhos", "Nazaré", "Óbidos", "Pedrógão Grande", "Porto de Mós"],
		"Lisbon": ["Lisboa", "Cascais", "Sintra", "Oeiras", "Loures", "Amadora", "Alenquer", "Arruda dos Vinhos", "Azambuja", "Cadaval", "Mafra", "Odivelas", "Sobral de Monte Agraço", "Torres Vedras", "Vila Franca de Xira"],
		"Portalegre": ["Portalegre", "Elvas", "Nisa", "Marvão", "Alter do Chão", "Arronches", "Avis", "Campo Maior", "Castelo de Vide", "Crato", "Fronteira", "Gavião", "Monforte", "Ponte de Sor", "Sousel"],
		"Porto": ["Porto", "Vila Nova de Gaia", "Matosinhos", "Gondomar", "Amarante", "Baião", "Felgueiras", "Lousada", "Maia", "Marco de Canaveses", "Paços de Ferreira", "Paredes", "Penafiel", "Santo Tirso", "Trofa", "Valongo"],
		"Santarém": ["Santarém", "Tomar", "Entroncamento", "Torres Novas", "Abrantes", "Alcanena", "Almeirim", "Alpiarça", "Barquinha", "Cartaxo", "Chamusca", "Constância", "Coruche", "Ferreira do Zêzere", "Golegã", "Mação", "Rio Maior", "Salvaterra de Magos"],
		"Setúbal": ["Setúbal", "Almada", "Barreiro", "Palmela", "Alcácer do Sal", "Grândola", "Moita", "Montijo", "Sesimbra", "Santiago do Cacém", "Sines", "Seixal"],
		"Viana do Castelo": ["Viana do Castelo", "Ponte de Lima", "Caminha", "Valença", "Arcos de Valdevez", "Melgaço", "Monção", "Paredes de Coura", "Ponte da Barca", "Vila Nova de Cerveira"],
		"Vila Real": ["Vila Real", "Chaves", "Peso da Régua", "Alijó", "Boticas", "Mesão Frio", "Mondim de Basto", "Montalegre", "Murça", "Ribeira de Pena", "Sabrosa", "Valpaços", "Vila Pouca de Aguiar"],
		"Viseu": ["Viseu", "Lamego", "Mangualde", "Tondela", "Armamar", "Carregal do Sal", "Castro Daire", "Cinfães", "Moimenta da Beira", "Mortágua", "Nelas", "Oliveira de Frades", "Penalva do Castelo", "Penedono", "Resende", "Santa Comba Dão", "São João da Pesqueira", "Sátão", "Sernancelhe", "Tabuaço", "Tarouca", "Vouzela"],
		"Madeira": ["Funchal", "Câmara de Lobos", "Santa Cruz", "Machico", "Calheta", "Ponta do Sol", "Porto Moniz", "Ribeira Brava", "Santana", "São Vicente", "Porto Santo"],
		"Açores": ["Ponta Delgada", "Angra do Heroísmo", "Horta", "Ribeira Grande", "Lagoa", "Nordeste", "Povoação", "Vila Franca do Campo", "Santa Cruz da Graciosa", "Calheta (São Jorge)", "Velas", "Lajes das Flores", "Santa Cruz das Flores", "Corvo", "Madalena", "São Roque do Pico", "Lajes do Pico"]
	}
	"Moçambique": None,
	"Brasil": None,
	"Cabo Verde": None,
	"Angola": None,
}


@app.route('/auth/register', methods=['POST'])
def register():
	data = request.json
	username = data.get('username')
	password = data.get('password')
	country = data.get('country')
	district = data.get('district')
	council = data.get('council')

	if country not in COUNTRIES_AND_DISTRICTS:
		return jsonify({"message": f"Invalid country. Supported countries: {', '.join(COUNTRIES_AND_DISTRICTS.keys())}"}), 400
	
	if country = "Portugal":
		if district not in COUNTRIES_AND_DISTRICTS["Portugal"]
			return jsonify({"message": f"Invalid district. Supported districts for Portugal: {', '.join(COUNTRIES_AND_DISTRICTS['Portugal'].keys())}"}), 400
		if council not in COUNTRIES_AND_DISTRICTS["Portugal"][district]:
            return jsonify({"message": f"Invalid council for district {district}. Supported councils: {', '.join(COUNTRIES_AND_DISTRICTS['Portugal'][district])}"}), 400

	for user in users:
		if user['username'] == username:
			return jsonify({"message": "User already exists"}), 400

	users.append({
		"username": username,
		"password": password,
		"country": country,
		"district": district if country = 
	})

	return jsonify({"message": "User registered successfully"}), 201

@app.route('/auth/login', methods=['POST'])
def login():
	data = request.json
	username = data.get('username')
	password = data.get('password')

	for user in users:
		if user['username'] == username and user['password'] == password:
			return jsonify({"message": "Login successful"}), 200

	return jsonify({"message": "Invalid credentials"}), 401


@app.route('/auth/google', methods=['POST'])
def login_with_google():
	data = request.json
	google_token = data.get('token')

	if google_token:
		return jsonify({"message": "Logged in with Google"}), 200
	else:
		return jsonify({"message": "Invalid Google token"}), 400

@app.route('/auth/guest', methods=['POST'])
def guest_login():
	return jsonify({"message": "Logged in as guest"}), 200

@app.route('/auth/galp', methods=['POST'])
def galp_login():
	data = request.json
	email = data.get('email')
	password = data.get('password')

	if email and email.endswith('@galp.com'):
		for user in users:
			if user ['username'] == email and user['password'] == password:
				return jsonify({"message": "Logged in with Galp credentials"}),
		return jsonify({"message": "Invalid credentials for Galp email"}),
	else
		return jsonify({"message": "Invalid email domain"}), 400

if __name__ == '__main__':
	app.run(debug=True)