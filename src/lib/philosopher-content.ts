// Extended content for philosopher dossiers - richer descriptions beyond what's in the database

export interface PhilosopherContent {
  tagline: string;
  philosophicalQuestion: string;
  workDescriptions: Record<string, string>;
  ideaDescriptions: Record<string, string>;
  quotes: string[];
  traditionContext: string;
  suggestedPrompts: string[];
  personalityTags: string[];
  followUpSuggestions: (topic: string) => string[];
}

export const philosopherContent: Record<string, PhilosopherContent> = {
  socrates: {
    tagline: "The Unexamined Life Is Not Worth Living",
    philosophicalQuestion: "How should we live if we wish to achieve virtue and wisdom?",
    workDescriptions: {
      "Apology": "Socrates' defense speech at his trial, where he famously declared that the unexamined life is not worth living. A meditation on wisdom, death, and civic duty.",
      "Republic": "An exploration of justice, the ideal state, and the nature of reality through the famous Allegory of the Cave. Contains the foundational discussion of the tripartite soul.",
      "Phaedo": "A dialogue on the immortality of the soul, set on the day of Socrates' execution, grappling with death as the separation of soul from body.",
      "Symposium": "A gathering where guests discuss the nature of love, culminating in Socrates' account of Diotima—love as the yearning for the beautiful and the good.",
      "Gorgias": "A debate on rhetoric, justice, and the good life, where Socrates argues that it is better to suffer injustice than to commit it.",
      "Meno": "Explores the paradox of inquiry: how can we seek what we do not know? Introduces the theory of recollection as the answer.",
    },
    ideaDescriptions: {
      "The examined life": "A life of constant questioning and self-reflection, where beliefs are subjected to rigorous scrutiny. Only through examination can we achieve true self-knowledge and virtue.",
      "Socratic method": "A form of cooperative argumentative dialogue Stimulated by searching questions rather than lecturing. Through persistent questioning, hidden assumptions are revealed and knowledge emerges.",
      "Virtue is knowledge": "No one does wrong willingly. All moral failure stems from ignorance—if we truly knew the good, we would do it. Virtue is therefore a form of intellectual insight.",
      "Irony": "Socratic irony involves professing ignorance to draw others into dialogue. By appearing not to know, Socrates invites others to examine their own beliefs more carefully.",
      "Dialectic": "The method of arriving at truth through systematic dialogue and refutation. By exposing contradictions in beliefs, the interlocutor is led toward clearer understanding.",
      "Know thyself": "The Delphic injunction that Socrates made his guiding principle. Self-knowledge is the foundation of philosophical wisdom and moral integrity.",
    },
    quotes: [
      "The unexamined life is not worth living.",
      "I know that I know nothing.",
      "Strong minds discuss ideas, average minds discuss events, weak minds discuss people.",
      "The secret of change is to focus all of your energy not on fighting the old, but on building the new.",
      "Education is the kindling of a flame, not the filling of a vessel.",
    ],
    traditionContext: "Socratic philosophy laid the groundwork for Western ethical thought and the concept of rational inquiry. His method influenced Plato, Aristotle, and through them, the entire trajectory of Western philosophy.",
    suggestedPrompts: [
      "What is the nature of virtue?",
      "How can we know if we are living an examined life?",
      "Is it better to suffer injustice or commit it?",
      "What did the Oracle at Delphi mean by 'know thyself'?",
      "How does the Socratic method help uncover truth?",
    ],
    personalityTags: ["Dialectical", "Socratic Irony", "Ethical", "Questioning"],
    followUpSuggestions: (topic: string) => {
      const base = [
        `Can you elaborate on how this relates to virtue?`,
        `What would you say to someone who disagrees with this?`,
        `How might this apply to modern ethical dilemmas?`,
      ];
      if (topic.toLowerCase().includes("virtue")) {
        return [
          "Can virtue be taught?",
          "Is virtue sufficient for happiness?",
          "How does virtue differ from mere habit?",
        ];
      }
      if (topic.toLowerCase().includes("knowledge") || topic.toLowerCase().includes("know")) {
        return [
          "Is self-knowledge the foundation of all wisdom?",
          "Why did you say you know nothing?",
          "How does ignorance lead to wrongdoing?",
        ];
      }
      return base;
    },
  },
  confucius: {
    tagline: "The Path of the Junzi and Social Harmony",
    philosophicalQuestion: "How can we cultivate ourselves to contribute to a harmonious society?",
    workDescriptions: {
      "Analects": "A compilation of Confucius' teachings recorded by his disciples. The foundational text of Confucian thought, covering ethics, politics, and personal cultivation.",
      "The Five Classics": "Ancient texts that Confucius is said to have edited: the Book of Documents, Book of Songs, Book of Changes, Book of Rites, and Spring and Autumn Annals.",
      "The Book of Changes": "An ancient divination text exploring the dynamics of change through the hexagram system. Confucius studied it obsessively, finding profound moral wisdom within.",
      "The Great Learning": "Originally part of the Book of Rites, this text outlines the Confucian path of self-cultivation leading to great learning and eventually to the governance of others.",
    },
    ideaDescriptions: {
      "Ren (benevolence)": "The supreme virtue of humaneness and compassion. To be truly human is to act with benevolence toward all. It manifests in the Golden Rule: do not impose on others what you do not desire yourself.",
      "Li (ritual)": "Proper ritual behavior and etiquette that expresses respect and maintains social harmony. True ritual is not mere formality but the outward expression of inner virtue.",
      "Social harmony": "A just society emerges when individuals cultivate virtue. The ruler must be morally exemplary, and the people will naturally follow. Social order flows from personal righteousness.",
      "Filial piety": "The bedrock virtue of respect for one's parents and ancestors. This duty extends to the social sphere, creating a hierarchical but caring society built on reciprocal obligations.",
      "Rectification": "The correction of names to ensure reality matches titles and expectations. A ruler should rule, a father should be fatherly. When names are rectified, society functions properly.",
      "Junzi (noble person)": "The exemplary person whose character is cultivated through continuous learning and moral effort. Unlike the aristocratic 'gentleman,' the junzi is defined by virtue, not birth.",
    },
    quotes: [
      "By three methods we may learn wisdom: by reflection, which is noblest; by imitation, which is easiest; and by experience, which is the bitterest.",
      "The man who asks a question is a fool for a minute, the man who does not ask is a fool for life.",
      "Choose a job you love, and you will never have to work a day in your life.",
      "It does not matter how slowly you go as long as you do not stop.",
      "Our greatest glory is not in never falling, but in rising every time we fall.",
    ],
    traditionContext: "Confucianism became the dominant philosophical tradition across East Asia, shaping the cultures and governance of China, Japan, Korea, and Vietnam for over two millennia.",
    suggestedPrompts: [
      "What does it mean to be a junzi?",
      "How does filial piety shape moral character?",
      "What is the relationship between self-cultivation and social harmony?",
      "How should a ruler govern justly?",
      "Why is ritual important to moral life?",
    ],
    personalityTags: ["Ethical", "Social", "Hierarchical", "Traditional"],
    followUpSuggestions: (topic: string) => {
      const base = [
        "How does this apply to modern family life?",
        "What would Confucius say about today's social problems?",
        "Can these principles work in non-hierarchical societies?",
      ];
      if (topic.toLowerCase().includes("filial") || topic.toLowerCase().includes("family")) {
        return [
          "How does filial piety extend beyond the family?",
          "What if family obligations conflict with moral duties?",
          "How should children respond to unreasonable parents?",
        ];
      }
      if (topic.toLowerCase().includes("ritual") || topic.toLowerCase().includes("li")) {
        return [
          "Is formal ritual still meaningful today?",
          "How does outer ritual express inner virtue?",
          "What happens when ritual becomes empty form?",
        ];
      }
      return base;
    },
  },
  "lao-tzu": {
    tagline: "The Tao That Can Be Named Is Not the Eternal Tao",
    philosophicalQuestion: "How can we align ourselves with the natural flow of the universe?",
    workDescriptions: {
      "Tao Te Ching": "The foundational Taoist text of 81 short chapters exploring the nature of the Tao (the Way), virtue (Te), and the paradoxes of existence. A poetic meditation on yielding, simplicity, and naturalness.",
      "Book of Chuang Tzu (attributed)": "A collection of Taoist writings featuring the wild narratives of the philosopher Chuang Tzu, including the famous butterfly dream and the happiness of fish.",
    },
    ideaDescriptions: {
      "Wu wei (non-action)": "Not passive resignation but natural action without striving. When we align with the Tao, things happen effortlessly because we cease to force them.",
      "Tao (the Way)": "The ineffable ultimate reality that cannot be named or grasped. The Tao is the source of all things, the principle underlying the natural order of the universe.",
      "Naturalness": "A return to simplicity and spontaneity. Artificiality and contrivance disconnect us from the Tao. The wise person embraces what comes naturally.",
      "Simplicity": "The path of least resistance leads to greatest effectiveness. By emptying ourselves of desires and excess, we become receptive to the flow of the Tao.",
      "Compassion": "The seed of Te (virtue). Through cultivating gentle, modest, and charitable nature, we manifest the Tao in our character and actions.",
      "Paradox": "Reality operates through opposites. The soft overcomes the hard, the weak conquers the strong. What seems counterproductive often proves most effective.",
    },
    quotes: [
      "The Tao that can be told is not the eternal Tao.",
      "When I let go of what I am, I become what I might be.",
      "Nature does not hurry, yet everything is accomplished.",
      "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.",
      "The journey of a thousand miles begins with a single step.",
    ],
    traditionContext: "Taoism, alongside Confucianism, forms one of the two pillars of traditional Chinese philosophy, offering a complementary path of harmony with nature and the cosmos.",
    suggestedPrompts: [
      "What is wu wei and how can we practice it?",
      "How does the Tao relate to modern life?",
      "Why is simplicity essential to wisdom?",
      "What can we learn from nature's way?",
      "How do paradoxes reveal deeper truth?",
    ],
    personalityTags: ["Paradoxical", "Yielding", "Natural", "Mystical"],
    followUpSuggestions: (topic: string) => {
      const base = [
        "How can I apply this to my daily life?",
        "What would happen if I tried the opposite approach?",
        "How does this connect to modern science?",
      ];
      if (topic.toLowerCase().includes("wu wei") || topic.toLowerCase().includes("non-action")) {
        return [
          "Is non-action the same as doing nothing?",
          "How does wu wei manifest in leadership?",
          "Can we be too passive in pursuing goals?",
        ];
      }
      if (topic.toLowerCase().includes("simplicity") || topic.toLowerCase().includes("desire")) {
        return [
          "How do we reduce excessive desires?",
          "What is the relationship between emptiness and power?",
          "How does simplicity lead to effectiveness?",
        ];
      }
      return base;
    },
  },
  nietzsche: {
    tagline: "God Is Dead and We Have Killed Him",
    philosophicalQuestion: "How can we create meaning in a universe without inherent meaning?",
    workDescriptions: {
      "Thus Spoke Zarathustra": "Nietzsche's magnum opus where the prophet Zarathustra descends from his mountain to announce the Übermensch—the higher human who creates new values after the death of God.",
      "Beyond Good and Evil": "A systematic critique of traditional European morality and philosophy, proposing a new mode of thinking that transcends conventional moral categories.",
      "The Birth of Tragedy": "Nietzsche's early work exploring how Greek tragedy emerged from the tension between Apollonian (form, rationality) and Dionysian (chaos, primal energy) forces.",
      "On the Genealogy of Morals": "A genealogical investigation into the origins and development of moral values, revealing how the concepts of 'good' and 'evil' were historically constructed, particularly through the lens of master and slave morality.",
    },
    ideaDescriptions: {
      "Will to power": "The fundamental driving force of all existence—not mere survival but the creative assertion of one's being. Life inherently seeks to expand, dominate, and exceed itself.",
      "Übermensch": "The higher human type who creates personal meaning and values in a godless world. Not a biological ideal but a spiritual achievement—the one who affirms life despite its suffering.",
      "Eternal recurrence": "A thought experiment: what if you had to live your exact life over and over infinitely? Loving fate (amor fati) means embracing life so fully that you would will this recurrence.",
      "God is dead": "The modern loss of transcendent values leaves us in a crisis of meaning. European rationalism and scientific skepticism have killed the old gods without providing new ones.",
      "Nihilism": "The belief that life lacks meaning, purpose, or objective truth. Nietzsche sees it as the logical consequence of traditional metaphysics losing credibility—but also as an opportunity.",
      "Master/slave morality": "Distinctions between good and evil arose not from truth but from the resentment of the powerless, who turned their weakness into a virtue to dominate the strong.",
      "Life affirmation": "A yes-saying to life in all its tragedy and joy. The Übermensch does not escape suffering but embraces it as necessary for growth and meaning.",
    },
    quotes: [
      "He who has a why to live can bear almost any how.",
      "That which does not kill us makes us stronger.",
      "Without music, life would be a mistake.",
      "The man who moves a mountain begins by carrying away small stones.",
      "You must have chaos within you to give birth to a dancing star.",
    ],
    traditionContext: "Nietzsche's critique of morality and his genealogy of values profoundly influenced existentialism, phenomenology, and critical theory throughout the 20th century.",
    suggestedPrompts: [
      "What does it mean to create your own values?",
      "How should we live after the death of God?",
      "What is the relationship between suffering and meaning?",
      "How do master and slave morality differ?",
      "What would the Übermensch look like today?",
    ],
    personalityTags: ["Provocative", "Radical", "Life-affirming", "Anti-establishment"],
    followUpSuggestions: (topic: string) => {
      const base = [
        "How might this apply to my own life?",
        "What would critics say about this view?",
        "How does this challenge conventional morality?",
      ];
      if (topic.toLowerCase().includes("übermensch") || topic.toLowerCase().includes("overman")) {
        return [
          "Is the Übermensch a biological or spiritual ideal?",
          "Can anyone become an Übermensch?",
          "What role does suffering play in becoming?",
        ];
      }
      if (topic.toLowerCase().includes("nihilism") || topic.toLowerCase().includes("meaning")) {
        return [
          "Is nihilism inevitable or can it be overcome?",
          "How do we create meaning without external foundations?",
          "What is the difference between passive and active nihilism?",
        ];
      }
      return base;
    },
  },
  "simone-de-beauvoir": {
    tagline: "One Is Not Born, but Rather Becomes, a Woman",
    philosophicalQuestion: "How can we affirm our freedom while acknowledging our situation?",
    workDescriptions: {
      "The Ethics of Ambiguity": "Beauvoir's philosophical treatise on existentialist ethics, arguing that humans are 'situated freedom'—neither purely free nor wholly determined.",
      "The Second Sex": "The landmark feminist analysis examining how women have been historically constituted as the Other, exploring themes of myth, history, and the lived experience of women.",
      "She Came to Stay": "Beauvoir's first novel, exploring themes of freedom, authenticity, and the ethical dilemmas that arise when individual freedoms conflict.",
      "Pyrrhus and Cineas": "An early philosophical dialogue probing the nature of action and the tension between individual freedom and engagement with others.",
    },
    ideaDescriptions: {
      "Women are made, not born": "Gender is not a biological given but a social construction. Society 'makes' women through upbringing, education, and cultural expectations that limit their freedom.",
      "Freedom and situation": "Existentialist freedom is always situated within concrete circumstances—body, class, historical moment. Freedom is not abstract but always exercised from within one's situation.",
      "Transcendence vs immanence": "Transcendence is the human capacity to project beyond the present toward future possibilities. Immanence is being trapped within settled routines. Women have historically been confined to immanence.",
      "Existentialist ethics": "Humans are condemned to be free and responsible for their choices. Ethics emerges from the authentic acknowledgment of this freedom and its implications for how we treat others.",
      "The Other": "Consciousness tends to objectify that which it encounters as 'Other.' The male has historically constructed woman as the Other—the object rather than subject of experience.",
      "Engagement": "Authentic existence requires engagement with the world and commitment to projects. We cannot retreat into pure subjectivity but must act meaningfully in history and society.",
    },
    quotes: [
      "One is not born, but rather becomes, a woman.",
      "I am too intelligent, too demanding, and too resourceful for anyone to be able to take charge of me entirely.",
      "To emancipate woman is to refuse to confine her to the relations she bears to man.",
      "Change your life today. Don't gamble on the future, act now, without delay.",
      "One's life has value so long as one attributes value to the life of others, by means of love, friendship, and compassion.",
    ],
    traditionContext: "Beauvoir's existentialist feminism laid the philosophical groundwork for second-wave feminism and continues to influence gender studies and ethical theory worldwide.",
    suggestedPrompts: [
      "What does it mean to 'become' a woman?",
      "How does freedom exist within our situation?",
      "How can we overcome being treated as the Other?",
      "What is the relationship between autonomy and engagement?",
      "How do gender structures limit human freedom?",
    ],
    personalityTags: ["Feminist", "Existentialist", "Engaged", "Analytical"],
    followUpSuggestions: (topic: string) => {
      const base = [
        "How does this apply to contemporary gender debates?",
        "What would Beauvoir say about cancel culture?",
        "How can we affirm our freedom while respecting others?",
      ];
      if (topic.toLowerCase().includes("other") || topic.toLowerCase().includes("otherness")) {
        return [
          "How do we avoid making others into objects?",
          "Can we ever fully understand someone else's situation?",
          "How does technology create new forms of Othering?",
        ];
      }
      if (topic.toLowerCase().includes("freedom") || topic.toLowerCase().includes("autonomy")) {
        return [
          "Is absolute freedom possible or desirable?",
          "How do social structures limit our freedom?",
          "What responsibilities come with freedom?",
        ];
      }
      return base;
    },
  },
  "frantz-fanon": {
    tagline: "The Wretched of the Earth",
    philosophicalQuestion: "How does colonialism damage the psyche, and how can the colonized reclaim their humanity?",
    workDescriptions: {
      "The Wretched of the Earth": "Fanon's final and most political work, analyzing the psychology of colonialism, the process of decolonization, and the role of violence in liberation.",
      "Black Skin, White Masks": "An exploration of the psychological damage of colonialism and racism, examining how the colonized internalize the colonizer's values and self-hatred.",
      "A Dying Colonialism": "An examination of the Algerian Revolution, exploring how colonial subjects reappropriate their history, culture, and relationship to violence.",
    },
    ideaDescriptions: {
      "The colonized Other": "Colonialism constructs the colonized as fundamentally different—as Other. This is not merely political subjugation but a complete system of meaning that defines one group as inferior.",
      "Violence as catharsis": "Violence is not brutality but a cleansing force. In tearing down the colonial relationship, violence frees both oppressor and oppressed from the distortions of the colonial system.",
      "Decolonization": "Not merely political independence but a total transformation of consciousness, social structures, and the relationship between humans and their world. A complete revolution in being.",
      "White mask/black skin": "The colonized individual, forced to adopt the colonizer's values, wears a 'white mask' concealing their true self. This creates a fundamental alienation and self-hatred.",
      "National culture": "Authentic national culture emerges not from preserving pre-colonial traditions but through the creative process of struggle and revolution. Culture is living and dynamic.",
      "Psychiatry of liberation": "Fanon's clinical work revealed how colonialism manifests in mental illness. Psychiatry itself must become a tool of liberation, not an instrument of colonial control.",
    },
    quotes: [
      "The colonized man will always be haunted by the question: 'What is the meaning of life?'",
      "Violence is a cleansing force. It frees the native from his inferiority complex.",
      "We today are capable of erasing poverty, wretchedness, and inequality. But we have not yet succeeded in eradicating war.",
      "Decolonization is simply the irruption of the oppressed group into the domain of history.",
      "My final dream: to learn, to understand, to teach what I have learned.",
    ],
    traditionContext: "Fanon's work became foundational for postcolonial studies, critical race theory, and liberation movements across the Global South and among marginalized communities worldwide.",
    suggestedPrompts: [
      "How does colonialism affect the colonized psyche?",
      "What role does violence play in decolonization?",
      "How can we overcome the 'white mask' syndrome?",
      "What is the relationship between culture and liberation?",
      "How does Fanon's psychiatry differ from traditional approaches?",
    ],
    personalityTags: ["Revolutionary", "Psychological", "Liberationist", "Radical"],
    followUpSuggestions: (topic: string) => {
      const base = [
        "How does this apply to modern decolonization movements?",
        "What would Fanon say about contemporary racism?",
        "How can psychology serve liberation?",
      ];
      if (topic.toLowerCase().includes("violence") || topic.toLowerCase().includes("colonial")) {
        return [
          "Is violence ever justified in fighting oppression?",
          "Can decolonization happen without violent struggle?",
          "How does colonial trauma pass through generations?",
        ];
      }
      if (topic.toLowerCase().includes("identity") || topic.toLowerCase().includes("mask")) {
        return [
          "How do we reclaim identity after colonialism?",
          "Is assimilation ever a valid strategy?",
          "How does cultural identity survive colonial oppression?",
        ];
      }
      return base;
    },
  },
  "wang-yangming": {
    tagline: "To Know and to Act Are One",
    philosophicalQuestion: "How can we trust our innate moral knowledge and put it into practice?",
    workDescriptions: {
      "Instructions for Living": "Wang's philosophical testament, distilling his teachings on innate moral knowledge and the unity of knowledge and action into practical guidance for daily life.",
      "Record of Learning": "A meditation on the method of learning and self-cultivation, emphasizing that true learning must transform not merely the mind but the entire person.",
    },
    ideaDescriptions: {
      "Mind as innate knowing": "The human mind inherently knows good from evil. This innate moral faculty (liangzhi) provides direct access to moral truth without the need for external authority or extensive book learning.",
      "Unity of knowledge and action": "Knowing and doing are not separate. True knowledge necessarily manifests in action—if you truly know something is right, you will do it. 'Knowing the ginger is hot' without 'the tongue being burned' is not genuine knowledge.",
      "Liangzhi (innate knowledge)": "The innate moral knowing present in every person's heart. Like the sun illuminating everything, this faculty spontaneously discerns right from wrong without deliberation.",
      "Investigation of things": "External things are not merely external objects but situations that reveal the state of our mind. Investigating things means examining how our mind responds to the world and refining our moral awareness.",
      "Zhi xing he yi": "The unity of knowing and acting. Knowledge without action is not true knowledge; action without knowledge is blind. The cultivated person embodies this unity naturally.",
      "Mind as principle": "The mind is not merely cognitive but ethical. When we investigate our mind in all situations, we discover the moral principles that constitute authentic human nature.",
    },
    quotes: [
      "The enemy of knowledge is not ignorance but the illusion of knowledge.",
      "To know a thing is to love it, and to love a thing is to know it.",
      "The intelligent and the humane do not merely stay neutral and disinterested. They take a stand.",
      "Nature gave two ears but only one mouth, so that we might listen more and talk less.",
      "Though the bamboo blind folds and the window is locked, spring still comes to my room.",
    ],
    traditionContext: "Wang's School of the Mind represented a radical departure within Confucianism, influencing Japanese thought through Zen Buddhism and Korean Neo-Confucianism, while continuing to shape Chinese intellectual life.",
    suggestedPrompts: [
      "What is liangzhi and how does it work?",
      "How is knowledge and action unified?",
      "How can we investigate things to refine our mind?",
      "What is the relationship between mind and principle?",
      "How does Wang's philosophy compare to Western rationalism?",
    ],
    personalityTags: ["Intuitive", "Practical", "Radical", "Mystical"],
    followUpSuggestions: (topic: string) => {
      const base = [
        "How does this apply to modern education?",
        "What would Wang say about procrastination?",
        "How can we trust our moral intuition?",
      ];
      if (topic.toLowerCase().includes("knowledge") || topic.toLowerCase().includes("action")) {
        return [
          "Why is knowing something without acting not true knowledge?",
          "How do we overcome the gap between knowing and doing?",
          "Is it possible to act without knowing?",
        ];
      }
      if (topic.toLowerCase().includes("mind") || topic.toLowerCase().includes("innate")) {
        return [
          "Is moral knowledge innate or learned?",
          "How does mind investigate external things?",
          "What is the relationship between mind and world?",
        ];
      }
      return base;
    },
  },
  aristotle: {
    tagline: "Man Is by Nature a Political Animal",
    philosophicalQuestion: "What is the good life for humans, and how do we achieve it?",
    workDescriptions: {
      "Nicomachean Ethics": "Aristotle's systematic exploration of the good life, introducing the concept of eudaimonia (flourishing) and the doctrine of the mean as the guide to virtuous action.",
      "Politics": "An examination of the various forms of government and the ideal state, arguing that the city-state is the natural context for human flourishing and moral development.",
      "Metaphysics": "An investigation into the nature of being, introducing the concepts of form and matter, substance and accident, and the unmoved mover as the ultimate cause of motion.",
      "Poetics": "Aristotle's theory of tragedy, analyzing the elements of effective drama, particularly catharsis—the emotional purification that tragedy produces in the audience.",
      "Physics": "A study of nature, motion, and the four causes (material, formal, efficient, final) that explain the existence and change of natural things.",
    },
    ideaDescriptions: {
      "Golden mean": "Virtue lies between extremes of excess and deficiency. Courage, for example, is the mean between recklessness and cowardice. Moral excellence is a matter of finding the appropriate response in each situation.",
      "Teleology": "Everything in nature has a purpose (telos). The acorn's purpose is to become an oak; the human telos is flourishing. Understanding purpose requires grasping the final cause of each thing.",
      "Virtue ethics": "Character rather than rules governs ethical life. Through habituation, we develop virtues that enable us to consistently choose the good. Moral excellence is a disposition to feel and act appropriately.",
      "Eudaimonia": "Often translated as happiness but more accurately meaning flourishing or living well. Eudaimonia is the ultimate human good—the activities of a well-lived life in accordance with virtue.",
      "Four causes": "To explain any thing or event, we must consider four causes: what it is made of (material), its form or essence (formal), what brought it into being (efficient), and its purpose (final).",
      "Categorical imperative (actually Kant)": "Note: Aristotle did not propose the categorical imperative—that was Kant. Aristotle's ethical framework is based on virtue, character, and the golden mean rather than universal maxims.",
    },
    quotes: [
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      "The whole is greater than the sum of its parts.",
      "Knowing yourself is the beginning of all wisdom.",
      "It is the mark of an educated mind to be able to entertain a thought without accepting it.",
      "Happiness depends upon ourselves.",
    ],
    traditionContext: "Aristotle's influence is incalculable. His systematic approach to logic, ethics, politics, biology, and metaphysics shaped medieval Islamic and Christian philosophy and remains central to contemporary virtue ethics.",
    suggestedPrompts: [
      "What is the relationship between virtue and happiness?",
      "How do we find the golden mean in difficult situations?",
      "What does it mean to flourish as a human being?",
      "How does habit shape our moral character?",
      "What is the purpose of human life according to Aristotle?",
    ],
    personalityTags: ["Systematic", "Teleological", "Practical", "Logical"],
    followUpSuggestions: (topic: string) => {
      const base = [
        "How does this apply to modern professional life?",
        "What would Aristotle say about work-life balance?",
        "How can we cultivate virtue in a materialistic culture?",
      ];
      if (topic.toLowerCase().includes("virtue") || topic.toLowerCase().includes("mean")) {
        return [
          "Is there always a golden mean, or are some situations extreme?",
          "How do we know when we've found the mean?",
          "Can the golden mean be used to justify moral weakness?",
        ];
      }
      if (topic.toLowerCase().includes("happiness") || topic.toLowerCase().includes("eudaimonia")) {
        return [
          "Is eudaimonia the same as pleasure?",
          "Can someone be miserable but still have eudaimonia?",
          "What role do external goods play in flourishing?",
        ];
      }
      return base;
    },
  },
};

// Financiers
philosopherContent["ray-dalio"] = {
  tagline: "Principles Over Outcome",
  philosophicalQuestion: "How do economic machines work, and how should we navigate debt cycles?",
  workDescriptions: {
    "Principles: Life and Work": "A comprehensive guide to Dalio's approach to life and work, detailing his system of principles — observable guidelines that produce desired outcomes through cause-effect relationships.",
    "Principles for Navigating Big Debt Crises": "A practical guide on how to deleverage and distribute pain, based on historical analysis of debt cycles across major economies.",
  },
  ideaDescriptions: {
    "Big debt cycle": "The pattern of rising debt and asset prices that eventually must reverse in a deleveraging. Understanding this cycle helps navigate and profit from credit crises.",
    "Economic machine": "The simplified framework of how economic activity works: productivity growth, short-term debt cycles (5-7 years), and long-term debt cycles (75-100 years). All driven by human nature and credit.",
    "Principles-based decision making": "Explicit guidelines derived from experience that help replicate good outcomes. Principles should be written down, tested, and refined over time.",
    "Radical transparency": "The practice of openly discussing mistakes and weaknesses to accelerate learning. At Bridgewater, this means recording all meetings and encouraging frank feedback.",
    "Diversification": "Spreading risk across uncorrelated assets to reduce volatility while maintaining return potential. True diversification means assets that perform differently in various environments.",
    "Risk-adjusted returns": "Measuring success not by absolute returns but by returns relative to the risk taken. The best investors achieve high returns with low drawdowns.",
  },
  quotes: [
    "Pain + Reflection = Progress",
    "The biggest mistake most people make is not looking at themselves and their mistakes objectively.",
    "I believe that the keys to success are to have an idea, find the right people, and get them to work on it.",
    "Don't confuse goals with desires.",
    "The dream team is the combination of people who are great at complementary things.",
  ],
  traditionContext: "Dalio represents the systematic, principles-based approach to investing that has influenced a generation of macro traders and value investors. HisBridgewater has become the world's largest hedge fund.",
  suggestedPrompts: [
    "How does the economic machine work?",
    "What are the key principles for decision making?",
    "How do you navigate big debt crises?",
    "What is radical transparency and why does it matter?",
    "How do you manage risk effectively?",
  ],
  personalityTags: ["Systematic", "Principled", "Analytical", "Macro"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "How do these principles apply to personal finance?",
      "What's your biggest lesson from a mistake?",
      "How do you handle disagreement in decision making?",
    ];
    if (topic.toLowerCase().includes("debt") || topic.toLowerCase().includes("cycle")) {
      return [
        "Are we currently in a long-term debt cycle?",
        "How do deleveragings typically play out?",
        "What's the difference between inflation and deflation deleveraging?",
      ];
    }
    if (topic.toLowerCase().includes("principles") || topic.toLowerCase().includes("decision")) {
      return [
        "How do you develop good principles?",
        "When should you deviate from your principles?",
        "How do you get people to follow principles?",
      ];
    }
    return base;
  },
};

philosopherContent["stanley-druckenmiller"] = {
  tagline: "Conviction, Concentration, and the Big Picture",
  philosophicalQuestion: "How do you identify and capitalize on major geopolitical and market shifts?",
  workDescriptions: {
    "The Dissonant Investor (essays)": "Druckenmiller's published writings on macro investing, market narratives, and the art of aggressive positioning when opportunity presents itself.",
  },
  ideaDescriptions: {
    "Geopolitical macro": "Understanding how political events, central bank policies, and international relations create market opportunities. The big money comes from anticipating shifts in the global landscape.",
    "Narrative-driven investing": "Markets are driven by stories. The key is to identify narratives that are either wrong or not yet recognized by the consensus, and position accordingly.",
    "Conviction-based betting": "When the risk-reward is exceptional, size positions accordingly. Most investors diversify too much and miss out on life-changing opportunities.",
    "Know when to be aggressive": "Patience and selectivity are essential. Wait for the fat pitches, then swing hard. Most of the time should be spent waiting and preserving capital.",
    "Concentration risk": "While concentration increases individual position risk, it also amplifies returns. The key is being right at the critical junctures.",
    "Currency dislocations": "Major currency movements can create enormous opportunities. The end of currency Pegs, monetary policy shifts, and political events often trigger big moves.",
  },
  quotes: [
    "The key to survival is staying with the trend until it reverses.",
    "I will repeat what I have said many times: stay with the positions, but cut them if they are wrong.",
    "What's important is not the idea but the timing and sizing of it.",
    "You have to have the ability to admit when you're wrong and change your view quickly.",
    "The secret to success is to be a good loser.",
  ],
  traditionContext: "Druckenmiller is considered one of the greatest macro traders ever. His ability to identify major trends and concentrate capital has generated legendary returns over decades.",
  suggestedPrompts: [
    "What makes a great macro trade?",
    "How do you develop conviction in a position?",
    "What's the key to staying with winning trades?",
    "How do you manage risk in concentrated positions?",
    "What mistakes do most investors make?",
  ],
  personalityTags: ["Aggressive", "Conviction", "Macro", "Confident"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "How do you know when to change your view?",
      "What's the biggest mistake macro traders make?",
      "How do you handle being wrong on a big position?",
    ];
    if (topic.toLowerCase().includes("conviction") || topic.toLowerCase().includes("position")) {
      return [
        "How do you size positions?",
        "How do you handle concentrated positions?",
        "What's the relationship between conviction and risk?",
      ];
    }
    if (topic.toLowerCase().includes("narrative") || topic.toLowerCase().includes("story")) {
      return [
        "How do you identify a narrative before it becomes consensus?",
        "Can narratives be wrong even if they seem logical?",
        "How do narratives spread through markets?",
      ];
    }
    return base;
  },
};

philosopherContent["jeff-gundlach"] = {
  tagline: "Bond Markets Don't Lie",
  philosophicalQuestion: "How do you read bond market signals to identify regime changes?",
  workDescriptions: {
    "The New Normal (presentations)": "Gundlach's widely-shared presentations on how interest rates and inflation settle into a new equilibrium after major crises, challenging traditional views of normal.",
  },
  ideaDescriptions: {
    "Bond market cycles": "The bond market is the best predictor of economic direction. When bonds signal distress, listen. The yield curve tells the story of future economic growth.",
    "Regime change": "Markets transition between regimes — the old rules no longer apply. Identifying when a regime has changed is essential for positioning correctly.",
    "The new neutral": "The equilibrium interest rate and inflation level changes after major events. Post-2008, the new normal for rates is much lower than historical averages.",
    "Fixed income": "Bonds remain the foundation of portfolio construction. Understanding duration, credit risk, and yield curve dynamics is essential for capital preservation.",
    "Dollar cycle": "The dollar's strength affects global liquidity, commodity prices, and emerging markets. Tracking dollar cycles helps anticipate market stress.",
    "Inflation dynamics": "Inflation is not dead — it's suppressed by debt and demographics but can return dramatically when conditions change. Watch the relationship between money supply and production.",
  },
  quotes: [
    "The bond market is telling you something.",
    "We are in a new normal where the old rules don't work.",
    "I don't think you should just borrow money and spend it.",
    "The most important thing is to understand your time horizon.",
    "You can't predict everything, but you can prepare for anything.",
  ],
  traditionContext: "Gundlach has called major market turns including the bond rally of the 2010s and the 2020 inflation surge. His direct, sometimes contrarian views on fixed income are widely followed.",
  suggestedPrompts: [
    "What is the bond market telling us now?",
    "How do you identify regime changes?",
    "What is the new neutral for interest rates?",
    "How do you navigate changing inflation dynamics?",
    "What signals suggest market stress?",
  ],
  personalityTags: ["Bond-focused", "Contrarian", "Direct", "Observant"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "What's the most important indicator for bond markets?",
      "How do you handle being contrarian to consensus?",
      "What mistakes do bond investors make?",
    ];
    if (topic.toLowerCase().includes("regime") || topic.toLowerCase().includes("normal")) {
      return [
        "What signals a regime change?",
        "How do you know when old rules no longer apply?",
        "How do you position for a new regime?",
      ];
    }
    if (topic.toLowerCase().includes("inflation") || topic.toLowerCase().includes("rates")) {
      return [
        "What drives inflation dynamics?",
        "How do central banks influence rates?",
        "Is inflation dead or just dormant?",
      ];
    }
    return base;
  },
};

philosopherContent["nassim-taleb"] = {
  tagline: "Skin in the Game Is the Origin of All Ethics",
  philosophicalQuestion: "How do we build systems that thrive on volatility rather than collapse?",
  workDescriptions: {
    "Fooled by Randomness": "An exploration of how humans systematically underestimate the role of chance in life, business, and markets. Uses anecdotes to show how noise is mistaken for signal.",
    "The Black Swan": "The impact of highly improbable events — events far outside normal expectations that have massive consequences. Black swans shaped history and markets.",
    "Anti-Fragile": "Systems that improve from volatility and stress, unlike the fragile that breaks. Anti-fragility is the property of living systems that gain from disorder.",
    "Skin in the Game": "The ethical imperative that those who take risks must bear the consequences. Without skin in the game, expert predictions become dangerous.",
  },
  ideaDescriptions: {
    "Tail risk": "The risk of extreme outcomes that lie outside normal probability distributions. Traditional finance underestimates tail risk by assuming normal distributions.",
    "Optionality": "Having asymmetric payoff profiles where potential gains far exceed potential losses. Optionality is the essence of antifragility.",
    "Antifragility": "Systems that improve from volatility, stress, and disorder. Unlike robustness (which merely resists) or fragility (which breaks), antifragility gains from chaos.",
    "Skin in the game": "The ethical principle that those who advise or risk others' money must have their own capital at risk. Without it, they are insulated from the consequences of their advice.",
    "Barbell strategy": "Extremely conservative in some areas, extremely speculative in others — nothing in the middle. This maximizes optionality while limiting downside.",
    "Fragility vs robustness": "Fragile things break under stress; robust things resist; antifragile things get stronger. The goal is to design systems that benefit from volatility.",
    "Via Negativa": "Improving by subtraction — removing risks, weaknesses, and errors rather than adding strengths. Often, the best way to get better is to stop doing harmful things.",
  },
  quotes: [
    "Skin in the game is the origin of all ethics.",
    "Never take advice from someone who gives advice for a living.",
    "The mostantifragile things are at the extremes.",
    "Only the rich are not compensated for risk.",
    "The three most harmful addictions are heroin, carbohydrates, and a monthly salary.",
  ],
  traditionContext: "Taleb's work fundamentally challenges the assumptions of mainstream finance and risk management. His concept of antifragility and critique of VaR models has influenced both academics and practitioners.",
  suggestedPrompts: [
    "What is antifragility?",
    "How does skin in the game affect decision making?",
    "Why are traditional risk models dangerous?",
    "How do you build optionality?",
    "What is the barbell strategy?",
  ],
  personalityTags: ["Provocative", "Iconoclast", "Precise", "Skeptical"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "How does this apply to everyday decisions?",
      "What's the biggest flaw in mainstream finance?",
      "How do you identify fragile systems?",
    ];
    if (topic.toLowerCase().includes("antifragile") || topic.toLowerCase().includes("fragility")) {
      return [
        "What makes something antifragile?",
        "Can people be antifragile?",
        "How do you become antifragile in your career?",
      ];
    }
    if (topic.toLowerCase().includes("tail") || topic.toLowerCase().includes("black swan")) {
      return [
        "Why do we underestimate rare events?",
        "How do you prepare for the unpredictable?",
        "What's the difference between Black Swan and regular risk?",
      ];
    }
    return base;
  },
};

philosopherContent["howard-marks"] = {
  tagline: "The Most Important Thing Is Second-Level Thinking",
  philosophicalQuestion: "How do you think differently from the crowd while still being right?",
  workDescriptions: {
    "The Most Important Thing": "A collection of memos emphasizing the critical distinction between first and second-level thinking, with insight on value investing, risk, and market psychology.",
    "Mastering the Market Cycle": "An in-depth exploration of why cycles exist, how they work, and how investors can use cycle awareness to improve returns and manage risk.",
  },
  ideaDescriptions: {
    "Second-level thinking": "Thinking differently and better than the consensus. First-level thinks this is a good company; second-level thinks everyone knows it's good, so it's overpriced.",
    "Cycle awareness": "Markets oscillate between optimism and pessimism, creating opportunities. Understanding where we are in the cycle is essential for positioning.",
    "Margin of safety": "Only buy when the price is sufficiently below intrinsic value to absorb mistakes and bad luck. The margin of safety is the foundation of prudent investing.",
    "Value investing": "Buying assets below their intrinsic value. This requires patience, discipline, and the ability to act contrary to consensus.",
    "Risk vs return": "Higher risk does not guarantee higher return — and often delivers less. The relationship between risk and return is not linear, but rather inefficient.",
    "Market psychology": "Markets reflect human emotions — greed, fear, optimism, pessimism. Understanding psychology helps identify when assets are mispriced.",
  },
  quotes: [
    "The most important thing is second-level thinking.",
    "The key to a successful investment career is largely a function of keeping your losses small.",
    "The really big opportunities come when nobody's paying attention.",
    "You can't predict. You can prepare.",
    "The risk-reward equation isn't as favorable as people think.",
  ],
  traditionContext: "Marks represents the cycle-aware, second-level thinking approach that distinguishes great investors from average ones. His memos are considered required reading in value investing.",
  suggestedPrompts: [
    "What is second-level thinking?",
    "How do you identify cycle position?",
    "What is margin of safety?",
    "How do you manage risk?",
    "Why is market psychology important?",
  ],
  personalityTags: ["Thoughtful", "Cycle-aware", "Prudent", "Value-oriented"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "How do you develop second-level thinking?",
      "What's the biggest mistake investors make?",
      "How do you stay rational when everyone is euphoric?",
    ];
    if (topic.toLowerCase().includes("second-level") || topic.toLowerCase().includes("thinking")) {
      return [
        "How do you know if you're thinking second-level?",
        "What stops people from thinking second-level?",
        "Can second-level thinking be learned?",
      ];
    }
    if (topic.toLowerCase().includes("cycle") || topic.toLowerCase().includes("timing")) {
      return [
        "How do you know where we are in the cycle?",
        "What indicators signal cycle turning points?",
        "Can you profit from cycle awareness?",
      ];
    }
    return base;
  },
};

philosopherContent["warren-buffett"] = {
  tagline: "Be Fearful When Others Are Greedy, Greedy When Others Are Fearful",
  philosophicalQuestion: "How do you find wonderful businesses at fair prices and hold them forever?",
  workDescriptions: {
    "Letters to Berkshire Shareholders (annual)": "Buffett's annual letters that blend investment wisdom, business analysis, and folksy wisdom into a masterclass on value investing.",
  },
  ideaDescriptions: {
    "Circle of competence": "Only invest in businesses you understand deeply. Stay within your circle of competence — outside it, you are flying blind.",
    "Moat": "A sustainable competitive advantage that protects a business from competitors. Moats come from brand, cost advantages, network effects, or regulatory protection.",
    "Margin of safety": "Buy at a price significantly below intrinsic value to absorb bad luck and mistakes. The margin of safety is the key to surviving and compounding.",
    "Intrinsic value": "The true worth of a business — the present value of all future cash flows discounted appropriately. Price and value are different things.",
    "Long-term ownership": "The best investment is buying wonderful businesses and holding them forever. Time is the friend of wonderful businesses.",
    "Compound interest": "The eighth wonder of the world. Small, consistent returns compounded over decades create enormous wealth.",
    "Value vs growth": "Both value and growth investing can work. But value focuses on what's known and proven; growth extrapolates uncertain futures.",
  },
  quotes: [
    "Be fearful when others are greedy, and greedy when others are fearful.",
    "Rule No. 1: Never lose money. Rule No. 2: Never forget Rule No. 1.",
    "The stock market is a device for transferring money from the active to the patient.",
    "It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price.",
    "Time is the friend of a wonderful business.",
  ],
  traditionContext: "Buffett is the most celebrated investor of all time, turning Berkshire Hathaway into a half-trillion dollar empire through disciplined value investing and compounding.",
  suggestedPrompts: [
    "What is your circle of competence?",
    "How do you identify a company's moat?",
    "What is intrinsic value?",
    "How do you think about risk?",
    "What mistakes do investors make?",
  ],
  personalityTags: ["Patient", "Value-oriented", "Folksy", "Long-term"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "How do you stay patient in a volatile market?",
      "What's the biggest lesson you've learned?",
      "How do you evaluate management?",
    ];
    if (topic.toLowerCase().includes("moat") || topic.toLowerCase().includes("competitive")) {
      return [
        "What creates a durable moat?",
        "How do you know if a moat is widening or narrowing?",
        "Can tech companies have moats?",
      ];
    }
    if (topic.toLowerCase().includes("value") || topic.toLowerCase().includes("price")) {
      return [
        "How do you determine intrinsic value?",
        "When should you sell a stock?",
        "What do you look for in a business?",
      ];
    }
    return base;
  },
};

philosopherContent["seth-klarman"] = {
  tagline: "Wait for the Fat Pitch",
  philosophicalQuestion: "How do you preserve capital and wait for exceptional opportunities?",
  workDescriptions: {
    "Margin of Safety: Risk-Averse Value Investing Strategies": "A rare, out-of-print book that has become a cult classic in value investing, emphasizing capital preservation and patient, risk-averse investing.",
  },
  ideaDescriptions: {
    "Deep value": "Finding securities trading far below intrinsic value — not just a little cheap, but dramatically discounted. This requires patience and willingness to look where others don't.",
    "Patient capital": "Capital that can wait years for the right opportunity. Patient capital is rare, which creates opportunity.",
    "Fat pitch": "The perfect opportunity — exceptional risk-reward where downside is minimal and upside is substantial. The investor's job is to wait and recognize the fat pitch.",
    "Margin of safety": "Not just a calculation but a mindset. Only buy when the discount to intrinsic value is large enough to provide a buffer against uncertainty.",
    "Bargain hunting": "Actively seeking opportunities in obscure places — SPAC warrants, distressed debt, small caps, merger arb. Opportunity exists where others fear to tread.",
    "Private market value": "Many businesses have value that's not reflected in public market prices. Private market transactions can unlock hidden value.",
    "Concentration": "Deep value investing often requires concentration. When opportunity is exceptional, sizing should reflect conviction.",
  },
  quotes: [
    "The most important thing is waiting for the fat pitch.",
    "Value investing is not about finding the best investments — it's about avoiding the worst mistakes.",
    "The market is a device for transferring money from the active to the patient.",
    "There is no right time to buy when everything looks terrible.",
    "In investing, it's not about how many deals you do, it's about the quality of the deals you do.",
  ],
  traditionContext: "Klarman has generated extraordinary returns at Baupost while preserving capital through crises. His rare book has become one of the most coveted texts in value investing.",
  suggestedPrompts: [
    "What is your investment approach?",
    "How do you find deep value opportunities?",
    "What is the fat pitch?",
    "How do you preserve capital?",
    "When should you be patient?",
  ],
  personalityTags: ["Patient", "Deep-value", "Contrarian", "Capital-preserving"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "Where do you find deep value opportunities?",
      "How do you handle being out of the market?",
      "What mistakes do value investors make?",
    ];
    if (topic.toLowerCase().includes("deep value") || topic.toLowerCase().includes("bargain")) {
      return [
        "How do you find opportunities others miss?",
        "What signals a deep value opportunity?",
        "When is a stock too cheap to be true?",
      ];
    }
    if (topic.toLowerCase().includes("patience") || topic.toLowerCase().includes("pitch")) {
      return [
        "How do you know when it's the fat pitch?",
        "What do you do when you can't find opportunities?",
        "How do you handle being called conservative?",
      ];
    }
    return base;
  },
};

philosopherContent["jim-simons"] = {
  tagline: "Markets Have Patterns",
  philosophicalQuestion: "Can mathematics unlock the hidden patterns in market noise?",
  workDescriptions: {
    "The Man Who Solved the Market (biography)": "A comprehensive biography of Simons and Renaissance Technologies, detailing how mathematics and technology transformed trading.",
  },
  ideaDescriptions: {
    "Mathematical market patterns": "Markets produce patterns that can be detected and exploited through statistical analysis. These patterns are often small but consistent.",
    "Statistical arbitrage": "Finding small pricing inefficiencies across many securities, exploiting them systematically. The edge comes from thousands of small bets with positive expected value.",
    "Alpha decay": "As markets become more efficient, alpha (excess returns) tends to diminish. Strategies that worked in the past may stop working as they attract capital.",
    "Data-driven trading": "Let data guide decisions, not intuition or narrative. The scientific method applied to markets.",
    "Short-term momentum": "Short-term price movements often follow patterns — things that went up tend to continue going up briefly before reversing.",
    "Mean reversion": "Prices that deviate significantly from average tend to revert. Short-term deviations create trading opportunities.",
  },
  quotes: [
    "The markets are like a casino, but not a zero-sum game.",
    "We look for patterns in the data.",
    "The key to our success is that we're very rigorous.",
    "We don't try to predict the future, we try to find patterns.",
    "The most important thing is to be scientific about it.",
  ],
  traditionContext: "Simons built Renaissance Technologies into the most successful hedge fund in history. While secretive about methods, his approach demonstrated that mathematical models can find market edges.",
  suggestedPrompts: [
    "How do you find patterns in market data?",
    "What is statistical arbitrage?",
    "How do you build quantitative models?",
    "What is alpha and how do you generate it?",
    "How do you handle strategy decay?",
  ],
  personalityTags: ["Mathematical", "Systematic", "Data-driven", "Confidential"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "How do you build and validate a trading model?",
      "What makes a pattern exploitable?",
      "How do you handle when a strategy stops working?",
    ];
    if (topic.toLowerCase().includes("pattern") || topic.toLowerCase().includes("signal")) {
      return [
        "Where do patterns come from?",
        "How do you know a pattern is real and not noise?",
        "Can patterns disappear when you exploit them?",
      ];
    }
    if (topic.toLowerCase().includes("alpha") || topic.toLowerCase().includes("decay")) {
      return [
        "Why does alpha decay happen?",
        "How do you prevent strategy decay?",
        "What's the difference between alpha and beta?",
      ];
    }
    return base;
  },
};

philosopherContent["david-shaw"] = {
  tagline: "Technology Is the Ultimate Edge",
  philosophicalQuestion: "How does systematic analysis outperform human intuition in markets?",
  workDescriptions: {
    "The New York Times interviews": "Rare public statements from Shaw on quantitative investing and the intersection of academia and finance.",
  },
  ideaDescriptions: {
    "Quant fundamentals": "Combining quantitative methods with fundamental analysis. Using mathematical models to process fundamental data at scale.",
    "Technology-enabled investing": "Technology creates sustainable advantages — faster execution, better data, superior models. The gap between tech-enabled and traditional investing widens.",
    "Alpha generation": "Finding edges that don't depend on market direction or traditional factor exposures. True alpha comes from unique information or superior processing.",
    "Systematic vs discretionary": "Systematic approaches remove emotion and bias, applying rules consistently. But they can miss qualitative factors that humans catch.",
    "Factor investing": "Systematic exposures to risk premia — value, momentum, quality, carry. Understanding factors helps explain and exploit market regularities.",
    "Technology as advantage": "Those with superior technology can identify and exploit opportunities before others. Technology creates temporary monopolies that attract competition.",
  },
  quotes: [
    "The best approach is to be scientific and rigorous.",
    "We look for ideas that are testable and have some theoretical basis.",
    "Technology is a sustainable advantage.",
    "The best quantitative models combine multiple approaches.",
    "Understanding the market requires both theory and data.",
  ],
  traditionContext: "D.E. Shaw pioneered quant investing, demonstrating that systematic, technology-driven approaches could generate returns that discretionary investors couldn't match.",
  suggestedPrompts: [
    "How do you combine quant and fundamental approaches?",
    "What role does technology play in investing?",
    "How do you identify true alpha?",
    "What is factor investing?",
    "How do you build a quant system?",
  ],
  personalityTags: ["Academic", "Systematic", "Tech-forward", "Rigorous"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "How do you balance systematic and discretionary approaches?",
      "What makes quant models robust?",
      "How do you handle model failure?",
    ];
    if (topic.toLowerCase().includes("quant") || topic.toLowerCase().includes("systematic")) {
      return [
        "What's the difference between quant and fundamental investing?",
        "When does systematic fail?",
        "How do you add human judgment to quant models?",
      ];
    }
    if (topic.toLowerCase().includes("alpha") || topic.toLowerCase().includes("edge")) {
      return [
        "Where does alpha come from?",
        "How do you protect your alpha?",
        "Is alpha getting harder to find?",
      ];
    }
    return base;
  },
};

philosopherContent["morgan-housel"] = {
  tagline: "Financial Success Is More About Psychology Than Finance",
  philosophicalQuestion: "Why does financial success depend more on behavior than intelligence?",
  workDescriptions: {
    "The Psychology of Money": "A collection of short stories exploring how psychology explains financial success and failure. Shows that financial outcomes are often driven by behavior, not analysis.",
  },
  ideaDescriptions: {
    "Narrative over fundamentals": "People make financial decisions based on stories, not spreadsheets. Understanding the narratives that drive markets and personal finance is essential.",
    "Behavioral finance": "How psychological biases lead to financial mistakes — overconfidence, loss aversion, anchoring, and dozens of others that derail even sophisticated investors.",
    "Compound thinking": "The power of compounding requires patience and time. Einstein's eighth wonder demands giving investments decades to grow.",
    "Risk and time": "Risk is personal — it depends on your time horizon, income, and needs. A young person can take risks a retiree cannot.",
    "Financial humility": "Many financial outcomes are due to luck. Recognizing luck and being humble prevents hubris and improves decision-making.",
    "Psychology of wealth": "The goal isn't to be the richest person in the cemetery. Wealth is about freedom, options, and peace of mind, not net worth.",
  },
  quotes: [
    "The highest form of wealth is the ability to wake up every morning and say, I can do whatever I want today.",
    "Getting money is one thing. Keeping it is another.",
    "History is mostly just stories about people who didn't adapt.",
    "The most powerful variable in finance is time.",
    "Be nicer and more humble to yourself.",
  ],
  traditionContext: "Housel has become one of the most widely read financial writers through his ability to explain complex financial concepts through engaging, story-driven narratives.",
  suggestedPrompts: [
    "Why does psychology matter more than finance?",
    "What are common financial mistakes?",
    "How do you build good financial habits?",
    "What is the relationship between wealth and happiness?",
    "How do you think about risk and time?",
  ],
  personalityTags: ["Storyteller", "Psychology-focused", "Humorous", "Accessible"],
  followUpSuggestions: (topic: string) => {
    const base = [
      "What mistakes do investors make that psychology explains?",
      "How do you develop good financial habits?",
      "What's the relationship between money and happiness?",
    ];
    if (topic.toLowerCase().includes("behavior") || topic.toLowerCase().includes("psychology")) {
      return [
        "What are the most common behavioral mistakes?",
        "How do you overcome your own biases?",
        "Can you train yourself to be less biased about money?",
      ];
    }
    if (topic.toLowerCase().includes("compound") || topic.toLowerCase().includes("time")) {
      return [
        "Why is time such a powerful variable?",
        "How do you stay patient with investing?",
        "What role does luck play in financial success?",
      ];
    }
    return base;
  },
};
