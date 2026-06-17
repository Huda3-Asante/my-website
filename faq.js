function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const isOpen = answer.style.display === 'block';

    // Close all
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

    // Open clicked one if it was closed
    if (!isOpen) {
        answer.style.display = 'block';
        element.classList.add('active');
    }
}