// Extended content for philosopher dossiers - richer descriptions beyond what's in the database

export interface PhilosopherContent {
  tagline: string;
  philosophicalQuestion: string;
  workDescriptions: Record<string, string>;
  ideaDescriptions: Record<string, string>;
  quotes: string[];
  traditionContext: string;
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
  },
};
