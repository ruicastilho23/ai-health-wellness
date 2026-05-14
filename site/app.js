const loadingScreen = document.getElementById('loading-screen');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const subscribeForm = document.getElementById('subscribe-form');
const submitButton = document.getElementById('submit-button');
const formMessage = document.getElementById('form-message');
const mealGeneratorForm = document.getElementById('meal-generator-form');
const generatorSummary = document.getElementById('generator-summary');
const generatedPlan = document.getElementById('generated-plan');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function trackEvent(name, parameters = {}) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, parameters);
}

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);

function hideLoadingScreen() {
  if (!loadingScreen) return;
  loadingScreen.classList.add('hide');
  setTimeout(() => loadingScreen.remove(), 450);
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoadingScreen, 450);
});

setTimeout(hideLoadingScreen, 1800);

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

document.addEventListener('click', (event) => {
  const affiliateLink = event.target.closest('a[data-affiliate-url]');
  if (!affiliateLink) return;
  event.preventDefault();
  window.location.href = affiliateLink.dataset.affiliateUrl;
}, true);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.7 });

document.querySelectorAll('.counter').forEach((counter) => counterObserver.observe(counter));

const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
const navTargets = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;

  const activeTarget = [...navTargets].reverse().find((section) => {
    const top = section.getBoundingClientRect().top;
    return top <= 130;
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', Boolean(activeTarget && link.getAttribute('href') === `#${activeTarget.id}`));
  });
}

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);
updateScrollState();

if (!reduceMotion) {
  const glowTargets = document.querySelectorAll('.brand-mark, .card, .article-card, .meal-card, .workflow-step, .step, .hero-panel, .comparison, .subscribe-form, .generator-form, .generated-day');

  glowTargets.forEach((target) => {
    target.addEventListener('pointermove', (event) => {
      const rect = target.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      target.style.setProperty('--mx', `${x}%`);
      target.style.setProperty('--my', `${y}%`);
    });
  });

  const heroPanel = document.querySelector('.hero-panel');
  if (heroPanel) {
    heroPanel.addEventListener('pointermove', (event) => {
      const rect = heroPanel.getBoundingClientRect();
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
      const rotateX = (((event.clientY - rect.top) / rect.height - 0.5) * -6);
      heroPanel.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    heroPanel.addEventListener('pointerleave', () => {
      heroPanel.style.transform = '';
    });
  }

  const brandMark = document.querySelector('.brand-mark');
  if (brandMark) {
    brandMark.addEventListener('pointermove', (event) => {
      const rect = brandMark.getBoundingClientRect();
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
      const rotateX = (((event.clientY - rect.top) / rect.height - 0.5) * -12);
      brandMark.style.transform = `perspective(420px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px) scale(1.04)`;
    });

    brandMark.addEventListener('pointerleave', () => {
      brandMark.style.transform = '';
    });
  }
}

function animateCounter(element) {
  const target = Number(element.dataset.target || 0);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if (subscribeForm && submitButton && formMessage) {
  subscribeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const idleText = submitButton.dataset.idleText || submitButton.textContent;
    formMessage.textContent = '';
    formMessage.classList.remove('error');
    submitButton.classList.add('loading');
    submitButton.textContent = 'Sending...';

    const email = document.getElementById('email').value.trim();
    const firstName = document.getElementById('firstName').value.trim();

    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      formMessage.textContent = 'Success. Your generator is ready.';
      trackEvent('generate_lead', {
        method: 'meal_generator_signup',
      });
      subscribeForm.reset();
      setTimeout(() => {
        window.location.href = data.generatorPath || 'meal-plan.html#free-meal-generator';
      }, 1500);
    } catch (error) {
      formMessage.textContent = error.message || 'Connection error. Please try again.';
      formMessage.classList.add('error');
    } finally {
      submitButton.classList.remove('loading');
      submitButton.textContent = idleText;
    }
  });
}

const mealTemplates = {
  balanced: [
    ['Greek yogurt, berries, oats, chia', 'Chicken quinoa bowl with avocado', 'Apple with almonds', 'Salmon, sweet potato, asparagus'],
    ['Eggs, spinach, whole-grain toast', 'Turkey hummus wrap with greens', 'Cottage cheese and berries', 'Beef stir-fry with brown rice'],
    ['Protein smoothie with banana and spinach', 'Chickpea quinoa salad with feta', 'Hard-boiled eggs', 'Chicken thighs with Brussels sprouts'],
    ['Overnight oats with strawberries', 'Tuna salad with crackers', 'Greek yogurt and walnuts', 'Cod with green beans and wild rice'],
    ['Avocado toast with poached eggs', 'Lentil soup and whole-grain bread', 'Low-sugar protein bar', 'Shrimp zucchini noodles'],
    ['Protein pancakes with berries', 'Chicken Caesar salad', 'Carrots and hummus', 'Pork tenderloin with root vegetables'],
    ['Egg white omelet with vegetables', 'Salmon kale salad', 'Rice cakes with almond butter', 'Chicken breast, sweet potato, broccoli'],
  ],
  'high-protein': [
    ['Egg white scramble with turkey', 'Chicken breast power bowl', 'Protein shake', 'Lean steak with potatoes'],
    ['Greek yogurt protein bowl', 'Tuna rice bowl', 'Cottage cheese', 'Turkey meatballs with pasta'],
    ['Protein oats with whey', 'Shrimp quinoa bowl', 'Boiled eggs', 'Chicken fajita plate'],
    ['Smoked salmon toast', 'Lean beef salad', 'Protein bar', 'Cod with lentils'],
    ['Cottage cheese pancakes', 'Chicken Caesar wrap', 'Greek yogurt', 'Turkey chili'],
    ['Omelet with chicken sausage', 'Salmon rice bowl', 'Jerky and fruit', 'Pork tenderloin with beans'],
    ['Protein smoothie bowl', 'Turkey burger salad', 'Tuna cucumber bites', 'Chicken kebab plate'],
  ],
  vegetarian: [
    ['Greek yogurt, berries, oats, chia', 'Tofu quinoa bowl with avocado', 'Apple with almonds', 'Tempeh, sweet potato, asparagus'],
    ['Eggs, spinach, whole-grain toast', 'Hummus wrap with greens and feta', 'Cottage cheese and berries', 'Tofu stir-fry with brown rice'],
    ['Protein smoothie with banana and spinach', 'Chickpea quinoa salad', 'Hard-boiled eggs', 'Lentil patties with vegetables'],
    ['Overnight oats with strawberries', 'Egg salad with crackers', 'Greek yogurt and walnuts', 'Paneer or tofu with wild rice'],
    ['Avocado toast with poached eggs', 'Lentil soup and whole-grain bread', 'Low-sugar protein bar', 'Chickpea zucchini noodles'],
    ['Protein pancakes with berries', 'Tempeh Caesar salad', 'Carrots and hummus', 'Bean chili with root vegetables'],
    ['Egg white omelet with vegetables', 'Tofu kale salad', 'Rice cakes with almond butter', 'Lentil bowl with broccoli'],
  ],
};

if (mealGeneratorForm) {
  mealGeneratorForm.addEventListener('submit', generateMealPlan);
}
window.generateMealPlan = generateMealPlan;

function generateMealPlan(event) {
  event.preventDefault();
  if (!generatorSummary || !generatedPlan) return;
  const weightInput = Number(document.getElementById('weight').value);
  const unit = document.getElementById('unit').value;
  const goal = document.getElementById('goal').value;
  const diet = document.getElementById('diet').value;

  const weightKg = unit === 'lb' ? weightInput / 2.20462 : weightInput;
  const calorieMultiplier = { 'fat-loss': 26, maintenance: 31, muscle: 36 }[goal];
  const proteinMultiplier = diet === 'high-protein' || goal === 'muscle' ? 2 : 1.6;
  const dailyCalories = roundToNearest(weightKg * calorieMultiplier, 50);
  const dailyProtein = Math.round(weightKg * proteinMultiplier);
  const mealCalories = splitDailyTarget(dailyCalories);
  const mealProtein = splitDailyTarget(dailyProtein);
  const templates = mealTemplates[diet];

  trackEvent('meal_plan_generated', {
    goal,
    diet,
    unit,
  });

  generatorSummary.classList.add('active', 'visible');
  generatorSummary.innerHTML = `
    <div class="summary-stat"><strong>${Math.round(weightKg)}</strong><span>kg body weight used</span></div>
    <div class="summary-stat"><strong>${dailyCalories.toLocaleString()}</strong><span>estimated daily calories</span></div>
    <div class="summary-stat"><strong>${dailyProtein}g</strong><span>estimated daily protein</span></div>
  `;

  generatedPlan.innerHTML = templates.map((dayMeals, index) => `
    <article class="generated-day meal-card glass reveal visible">
      <h3>Day ${index + 1}: ${getGeneratedDayTitle(index)}</h3>
      ${renderGeneratedMeal('Breakfast', dayMeals[0], mealCalories[0], mealProtein[0])}
      ${renderGeneratedMeal('Lunch', dayMeals[1], mealCalories[1], mealProtein[1])}
      ${renderGeneratedMeal('Snack', dayMeals[2], mealCalories[2], mealProtein[2])}
      ${renderGeneratedMeal('Dinner', dayMeals[3], mealCalories[3], mealProtein[3])}
    </article>
  `).join('');
  generatorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderGeneratedMeal(type, meal, calories, protein) {
  return `<div class="meal-row"><strong>${type}</strong><span>${meal}<em>${calories} kcal | Protein: ${protein}g</em></span></div>`;
}

function splitDailyTarget(target) {
  return [
    Math.round(target * 0.22),
    Math.round(target * 0.32),
    Math.round(target * 0.12),
    Math.round(target * 0.34),
  ];
}

function roundToNearest(value, nearest) {
  return Math.round(value / nearest) * nearest;
}

function getGeneratedDayTitle(index) {
  return ['Energizing Start', 'Protein Power', 'Balanced Fuel', 'Lean & Clean', 'Recovery Day', 'Variety Boost', 'Finish Strong'][index];
}
