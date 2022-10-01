var portfolioValue = 0;
var bitcoinPrice = 0;
var scenarios = 0;
var scenarioCount = 0;
var priceList = [];
var probList = [];
var payouts = [];

function startquestions()
{
    document.querySelector('input').type = 'text';
    document.getElementById("currency").style.display = "block";
    document.getElementById("button").innerText = "Next";
    document.querySelector('h1').textContent = "How Large is your portfolio?";
    document.getElementById("button").onclick = secondQuestion;
}

function secondQuestion()
{
    var input = document.querySelector('input');
    if(!NumberErrorCheck(input))
        return;
    portfolioValue = input.value;
    document.querySelector('h1').textContent = "What is the current price of Bitcoin?";
    input.value = "";
    input.placeholder = '19500';
    document.getElementById("button").onclick = thirdQuestion;
}

function thirdQuestion()
{
    var input = document.querySelector('input');
    if(!NumberErrorCheck(input))
        return;
    bitcoinPrice = parseInt(input.value);
    document.querySelector('h1').textContent = "How many price scenarios would you like to test?";
    document.getElementById("currency").style.display = "none";
    input.value = "";
    input.style.borderLeft = "2px solid #cccc";
    input.style.borderRadius = "7px 7px 7px 7px";
    input.placeholder = '2';
    input.style.textAlign = 'center';
    input.style.maxWidth = "100px";
    document.getElementById("button").onclick = openPopup;
}

function openPopup()
{
    var probInput = document.getElementById('sprobinput');
    scenarios = parseInt(document.querySelector('input').value);
    document.getElementById("btc-modal").style.visibility = 'hidden';
    document.getElementById("popup").style.visibility = 'visible';
    if(scenarios == 1)
    {
        probInput.value = Math.round(remainingPercent(),1);
        probInput.readOnly = true;
    }
}


function scenarioLoop()
{
    var probInput = document.getElementById('sprobinput');
    var priceInput = document.getElementById('spriceinput');
    scenarioProb = probInput.value /100;
    probList.push(scenarioProb);
    scenarioPrice = priceInput.value;
    priceList.push(scenarioPrice);
    scenarioCount++;
    priceInput.value = "";
    probInput.value = "";
    document.getElementById('popH1').textContent = "Scenario " + (scenarioCount + 1);
    if (scenarioCount == scenarios)
    {
        seeResults();
    }
    else if(scenarioCount == scenarios -1)
    {
        probInput.value = Math.round(remainingPercent(),1);
        probInput.readOnly = true;
    }
}

function remainingPercent()
{
    var probSum = 0;
    for(i = 0; i < probList.length; i++)
    {
        probSum += probList[i];
    }
    return (1-probSum)*100;
}

function seeResults()
{
    var prob = findMax();
    if (prob <0)
    {
        prob = 0;
    }
    var purchaseSize = Math.round(prob/100 * portfolioValue,2);
    var conicString = 'conic-gradient(black 0.00% ' + prob + '%, yellow ' + prob + '%)'
    document.getElementById("popup").style.visibility = 'hidden';
    document.getElementById("resultsH1").textContent = "Optimal Allocation of Bitcoin: " + prob + "%";
    document.getElementById("resultsH2").textContent = "$" + purchaseSize;
    document.getElementById("results").style.visibility = "visible";
    document.getElementById("container").style.background = conicString;
}

function findMax()
{
    for(i = 0; i <priceList.length; i++)
    {
        var payout = priceList[i]/bitcoinPrice - 1;
        payouts.push(payout)
    }
    var optimal = 0;
    var optI = -1;
    for(i = 1; i <=100; i++)
    {
        //https://math.stackexchange.com/questions/662104/kelly-criterion-with-more-than-two-outcomes
        sum = 0;
        for(j = 0; j <probList.length; j++)
        {
            var log = Math.log(1+(payouts[j] * (i/100)));
            sum += probList[j] * log;
        }
        if (sum > optimal)
        {
            optimal = sum;
            optI = i;
        }
    }
    return optI;
}

function restart()
{
    document.getElementById("results").style.visibility = 'hidden';
    document.getElementById("btc-modal").style.visibility = 'visible';
    document.getElementById("currency").style.display = "block";
    document.getElementById("button").style.visibility = "visibile";
    document.getElementById('popH1').textContent = "Scenario 1";
    document.getElementById('sprobinput').readOnly = false;
    portfolioValue = 0;
    bitcoinPrice = 0;
    scenarios =0 ;
    scenarioCount = 0;
    priceList = [];
    probList = [];
    payouts = [];
    input.style.borderLeft = 'none';
    input.style.borderRadius = "0 7px 7px 0";
    input.placeholder = '1000';
    input.style.textAlign ='left';
    input.style.maxWidth = '150px';
    startquestions();

}

function NumberErrorCheck(element)
{
    if (element.value.length == 0)
    {
        alert("Please enter number values");
        return false;
    }
    else if (isNaN(element.value))
    {
        alert("Must input numbers");
        return false;
    }
    else if (element.value < 0)
    {
        alert("Value must be greater than 0")
        return false;
    }
    else{
        return true;
    }
}