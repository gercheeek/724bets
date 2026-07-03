async function check() {
  try {
    const res = await fetch('https://data-reality.com/domain.php');
    const data = await res.json();
    console.log("JSON response:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}
check();
