

		 playerChips=1000;
	function shuffle(array) {
		var tmp, current, top = array.length;

		if(top) while(--top) {
			current = Math.floor(Math.random() * (top + 1));
			tmp = array[current];
			array[current] = array[top];
			array[top] = tmp;
		}
		return array;
	}
	
	evaluateHand = function(cardList) {
		value = 0;
		numAces = 0;
		
		for ( i = 0; i < cardList.length; i = i + 1)
		{	
			if ( cardList[i].value >= 10 && cardList[i].value <= 13)
				value = value + 10;
			else if (cardList[i].value == 14)
			{
				value = value + 11;
				numAces++;
			}
			else
				value = value + cardList[i].value;
		}
		
		while ( value > 21 && numAces > 0)
		{
			value = value - 10;
			numAces--;
		}
		return value;
	}
	
	Player = function () {
		this.cards = []
	}
	
	gameOver = function (won, blackjack) {
		if (won == "win") {
			if (blackjack) {
				playerChips += 15;
			}
			else {
				playerChips += 10;
			}
		}
		else if (won == "lose"){
			playerChips -= 10;
		}
		$("#player-chips-value").html(playerChips);
		$("#deal").attr("disabled", false);
		$("#hit").attr("disabled", true);
		$("#stand").attr("disabled", true);
		$("#split").attr("disabled", true);
		$("#dd").attr("disabled", true);
	}
	
	evaluateGame = function() {
		playerScore = evaluateHand(player1.cards);
		$("#player-score-value").html(playerScore);
		if ( playerScore > 21 ) {
			setTimeout(function() { alert("Busted!"); gameOver("lose") }, 500);
			return;
		}
		else if (playerScore == 21)
		{
			if (player1.cards.length == 2) {
				alert("blackjack!");
				gameOver("win", true);
				return;
			}
		}
		$("#hit").attr("disabled", false);
		$("#stand").attr("disabled", false);
		if (player1.cards.length == 2) {
			$("#dd").attr("disabled", false);
			if (player1.cards[0].value == player1.cards[1].value && player1.cards[0].value != 11) {
				$("#split").attr("disabled", false);
			}
		}
		
	}
	
	shuffleNewDeck = function() {
		downCardFile = "classic-cards/b2fv.png";
		cards=[];
		value = 14;
		j = 0;
		for (var i = 1; i <= 52; ++i)
		{
			cards[i]= { "file" : "classic-cards/" + i + ".png", "value" : value };
			j++;
			j = j % 4;
			if ( j == 0) value--;
		}	
		shuffle(cards);
	}
	
	/**
	* TODO dealer blackjack
	*/
	
	drawCards = function(cards, prefix) {
		console.log(cards);
		for (i = 0; i < cards.length; i++) {
			$("#" + prefix + i).attr("src", cards[i].file);
			$("#" + prefix + i).show();
		}
	}
	
	drawDealerDown = function(card) { 
		$("#dealer-card0").attr("src", card.file);
		$("#dealer-card1").attr("src", downCardFile);
	}
			
	clearScreen = function () {
		$("#dealerContainer").empty();
		$("#container").empty();
	}
	
	
	getCard = function () {
		var cardNum = player1.cards.length;
		
		var nextCard = cards.pop();
		player1.cards[cardNum] = nextCard;
		
		$("#container").append("<img id=\"card" + cardNum + "\" src=\"\" />");
	    var left = 300 + (25 * cardNum); //72
		
		var wrappedCard = $("#card" + cardNum);		
	    wrappedCard.css({ 'position' : 'absolute', 'height' : '96', 'width': '72', 'left': left, 'top':50 });
		animateCardToLocation(wrappedCard, nextCard.file); 
	}
	
	getDealerCard = function() {
		var cardNum = dealerCards.length;
		var nextCard = cards.pop();
		dealerCards[cardNum] = nextCard;
		$("#dealerContainer").append("<img id=\"dealer-card" + cardNum + "\" src=\"\" >");
		var left = 300 + (25 * cardNum);
		var wrappedCard = $("#dealer-card" + cardNum);
		wrappedCard.css( { 'position' : 'absolute', 'height' : '96', 'width': '72', 'left': left, 'top': 50});
		animateCardToLocation(wrappedCard, cardNum == 0 ? downCardFile : nextCard.file);
	}
	
	animateCardToLocation = function (wrappedCard, file) {
		$("#small-card").queue(function() {
							$("#small-card").show();
							$("#small-card").offset(smallCardOffset);
							$(this).dequeue();
						})
						.animate ( {
							top: wrappedCard.offset().top,
							left: wrappedCard.offset().left
						},
						500
						)
						.queue ( function() {
							wrappedCard.attr("src", file);
							$(this).dequeue();
					});					
	}
		
		
   $(document).ready(function() {   

		for ( var i = 0; i <= 6; i++)
		{
			$("#dealer-card" + i).css("margin-left: 20px;");
		}
	
		smallCardOffset = { "top" : 0, "left": 308 } 
		gameOver("push");
		 $("#player-chips-value").html(playerChips);
	
		$('#deal').bind('click', function() {
			clearScreen();
			shuffleNewDeck();
			player1 = new Player();
			
			getCard();
			getCard();
			
			dealerCards = [];
			getDealerCard();
			getDealerCard();
			//$("#small-card").queue(function() { $(this).hide(); } );
			$("#small-card").queue(function() { evaluateGame(); $(this).dequeue(); });
			 return true;
	    });
		
		$('#hit').bind('click', function() {
			getCard();
			$("#small-card").queue(function() { evaluateGame(); $(this).dequeue(); });
			return true;
		});
		
		nextDealerInterval = function () {
			console.log("nextDealerInterval");
			dealerScore = evaluateHand(dealerCards);
			if ( dealerScore < 17 ) {
				dealerSize = dealerCards.length;
				getDealerCard();
				drawCards(dealerCards, "dealer-card");
				setTimeout(nextDealerInterval, 10);
			} 
			else {
				playerScore = evaluateHand(player1.cards);
				if ( dealerScore > 21) {
					alert("Dealer busts. You win!");
					gameOver("win");
				}
				else if ( dealerScore > playerScore ) {
					alert("Dealer wins.");
					gameOver("lose");
				}
				else if ( dealerScore == playerScore) {
					alert("Push.");
					gameOver("push");
				}
				else { 
					alert("You win!");
					gameOver("win");
				}
			}
		}
		
		$('#stand').bind('click', function() {
			drawCards(dealerCards, "dealer-card");
			setTimeout(nextDealerInterval, 1000);
			return true;
		});
		
		$('#animate').bind('click', function() {
		});
    });

