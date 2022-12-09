const loadButtons = () => {
    // don't want to add these buttons to main page
    // so if there is nothing after e.g. 'medium.com/' url we will just return 
    if (window.location.pathname.length<2) return
  
    // Bottom button
    // add if there isn't already one (we can performe some events more than once, but don't want to add more than one button)
    if (!document.querySelector(".btn-bottom")) {
      const bottomBar = (document.querySelector("div.labstabs")) 
      
      const tabInput = document.createElement("input")
      tabInput.setAttribute("type","radio")
      tabInput.setAttribute("name","tabs")
      tabInput.setAttribute("id","tabsix")
      
      
      // here we are creating structure for button
      const btnBottom = document.createElement("label")
      btnBottom.setAttribute("for", "tabsix")
      btnBottom.classList.add("btn-bottom")
      btnBottom.classList.add("btn-summary")
      btnBottom.textContent = "Summary"

      const summaryDiv = document.createElement("div")
      summaryDiv.classList.add("tab") 
      summaryDiv.classList.add("summary-div")

      bottomBar?.appendChild(tabInput)
      bottomBar?.appendChild(btnBottom)
      bottomBar?.appendChild(summaryDiv)
    }
    // for all buttons we want to add event listener that will call function for summarization
    const allButtons = document.querySelectorAll(".btn-summary")
    console.log("Added summary button",allButtons)
    allButtons.forEach(btn => btn.addEventListener("click", prediction))
  }

  window.onload = () => {
    loadButtons()
  };

// request to cohere xlarge model
const cohereReq = async prompt => {

    const summaryElement = document.querySelector(".summary-div")
    summaryElement.textContent = "Fetching Summary from Cohere API. Please wait ...."

    const summaryLoading = document.createElement("div")
    summaryLoading.classList.add("loading")


    const modelSettings = JSON.stringify({
      model: "xlarge",
      prompt,
      max_tokens: 128,
      temperature: 0.7,
      k: 0,
      stop_sequences:["--"],
      p: 0.75
    })
    console.log("Entered Cohere request")
  
    const reqBody = {
      method: "POST",
      mode: 'cors',
      headers: {
          "Authorization": "BEARER {COHERE_API_KEY}",  // replace with your API key
          "Content-Type": "application/json", 
          "Cohere-Version": "2021-11-08",   // model version
          // I added some headers to prevent CORS errors
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
      },
      body: modelSettings,
      redirect: "follow"
    };
    

    let response = await fetch("https://api.cohere.ai/generate", reqBody);
    response = response.json();
  
    return response;
  }

  const prediction = async e => {
    
    // Extract abstract
    const abstractElement = document.querySelector("blockquote.mathjax")
    
    const abstract = abstractElement?.textContent
    
    const prompt = `Abstract: Due to the success of deep learning to solving a variety of challenging machine learning tasks, there is a rising interest in understanding loss functions for training neural networks from a theoretical aspect. Particularly, the properties of critical points and the landscape around them are of importance to determine the convergence performance of optimization algorithms. In this paper, we provide a necessary and sufficient characterization of the analytical forms for the critical points (as well as global minimizers) of the square loss functions for linear neural networks.We show that the analytical forms of the critical points characterize the values of the corresponding loss functions as well as the necessary and sufficient conditions to achieve global minimum.Furthermore, we exploit the analytical forms of the critical points to characterize the landscape properties for the loss functions of linear neural networks and shallow ReLU networks.One particular conclusion is that: While the loss function of linear networks has no spurious local minimum, the loss function of one-hidden-layer nonlinear networks with ReLU activation function does have local minimum that is not global minimum.
    TLDR: We provide necessary and sufficient analytical forms for the critical points of the square loss functions for various neural networks, and exploit the analytical forms to characterize the landscape properties for the loss functions of these neural networks.
    --
    Abstract: Reinforcement learning in an actor-critic setting relies on accurate value estimates of the critic.However, the combination of function approximation, temporal difference (TD) learning and off-policy training can lead to an overestimating value function. A solution is to use Clipped Double Q-learning (CDQ), which is used in the TD3 algorithm and computes the minimum of two critics in the TD-target. We show that CDQ induces an underestimation bias and propose a new algorithm that accounts for this by using a weighted average of the target from CDQ and the target coming from a single critic.The weighting parameter is adjusted during training such that the value estimates match the actual discounted return on the most recent episodes and by that it balances over and underestimation.Empirically, we obtain more accurate value estimates and demonstrate state of the art results on several OpenAI gym tasks.
    TLDR: A method for more accurate critic estimates in reinforcement learning.
    --
    Abstract: "Natural Language Processing models lack a unified approach to robustness testing. In this paper we introduce WildNLP - a framework for testing model stability in a natural setting where text corruptions such as keyboard errors or misspelling occur. We compare robustness of models from 4 popular NLP tasks: Q&A, NLI, NER and Sentiment Analysis by testing their performance on aspects introduced in the framework. In particular, we focus on a comparison between recent state-of-the-art text representations and non-contextualized word embeddings. In order to improve robustness, we perform adversarial training on selected aspects and check its transferability to the improvement of models with various corruption types. We find that the high performance of models does not ensure sufficient robustness, although modern embedding techniques help to improve it. We release corrupted datasets and code for WildNLP frame- work for the community. 
    TLDR: We compare robustness of models from 4 popular NLP tasks: Q&A, NLI, NER and Sentiment Analysis by testing their performance on perturbed inputs.
    --
    ${abstract}
    TLDR:`
    // const prompt = `Summarize shortly this article based on the abstract.
    // ${title}
    // ${abstract}
    // TLDR:
    //  `

    const response = await cohereReq(prompt)

  
    //from response get generations (if response exists), from generations get first element (if generations exist), and from it get text (if theres is element exists)
    const text = response?.generations?.shift()?.text.slice(0, -3); // Remove last 3 characters which correspond to the generated stop sequence
  
    const summaryElement = document.querySelector(".summary-div")
    summaryElement.textContent = text
    console.log("Returned result", text)
  }