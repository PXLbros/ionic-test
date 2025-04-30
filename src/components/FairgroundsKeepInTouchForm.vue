<template>
  <div class="keep-in-touch">
    <h2 class="touch-title">KEEP IN TOUCH</h2>
    <p>Sign up for the latest updates.</p>
    <div class="contact-form">
        <label for="email">Email*</label>
        <input type="email" id="email" placeholder="Enter your email..." />
        <p class="disclaimer">By submitting this form, you are consenting to receive marketing emails from: The Great New York State Fair, 581 State Fair Blvd., Syracuse, NY, 13209, US, https://www.nysfair.org. You can revoke your consent to receive emails at any time by using the SafeUnsubscribe® link, found at the bottom of every email. <a href="https://www.constantcontact.com/legal/service-provider" target="_blank">Emails are serviced by Constant Contact</a>.</p>
        <button class="fg-signup">Sign Up</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keep-in-touch {
  background-color: #19262D;
  padding: 1px 20px 40px 20px;
  color: white;
  text-align: center;
}

.touch-title {
  font-family: 'pt-sans-bold', sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 300px;
  margin: 0 auto;
}

.contact-form label {
  align-self: flex-start;
  margin-bottom: 5px;
  font-weight: 500;
}

.contact-form input {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #FFF;
  color: #000;
}

.disclaimer {
  $color: #ccc;

  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: #ccc;
  margin: 0px;
  text-align: start;

  a {
    color: $color;
  }
}

.fg-signup {
  background-color: #FFD100;
  color: #000;
  padding: 20px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 60%;
  font-weight: 700;
  font-size: 14px;
  margin-top: 25px;
  align-self: start;
  text-transform: uppercase;
}
</style>
