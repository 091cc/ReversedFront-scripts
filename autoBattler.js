/**
 * @file autoBattler.js
 * @description Automated battle script for sequential PvP rank battle cycles.
 *              Handles navigation, battle initiation, auto-battle activation,
 *              and post-battle reward collection.
 */

(function () {
  'use strict';

  console.log('=== Auto Battler Initialized ===');

  // ---------------------------------------------------------------------------
  // Utility Functions
  // ---------------------------------------------------------------------------

  /**
   * Returns a Promise that resolves after a specified delay.
   * @param {number} ms - Duration to wait in milliseconds.
   * @returns {Promise<void>}
   */
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Searches for a DOM element matching the given CSS selector whose
   * trimmed text content equals the specified string.
   *
   * @param {string} text      - The exact text content to match.
   * @param {string} selector  - CSS selector used to query candidate elements.
   * @returns {Element|undefined} The first matching element, or undefined if not found.
   */
  function findElementByTextAndSelector(text, selector) {
    return Array.from(document.querySelectorAll(selector))
      .find((el) => el.textContent.trim() === text);
  }

  /**
   * Polls the DOM at 500 ms intervals until an element matching the given
   * selector appears, then dispatches a full synthetic mouse-click sequence
   * (mousedown → mouseup → click) on it.
   *
   * @param {string} selector          - CSS selector of the target element.
   * @param {number} [timeout=30000]   - Maximum wait time in milliseconds.
   * @param {string} [label='Element'] - Human-readable label used in log messages.
   * @returns {Promise<true>} Resolves with true when the element is clicked.
   * @throws {Error} Rejects if the element is not found within the timeout.
   */
  function waitForElementAndClick(selector, timeout = 30000, label = 'Element') {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        const element = document.querySelector(selector);

        if (element) {
          clearInterval(intervalId);

          const { left: clientX, top: clientY } = element.getBoundingClientRect();
          const eventOptions = { view: window, bubbles: true, cancelable: true, clientX, clientY };

          ['mousedown', 'mouseup', 'click'].forEach((type) =>
            element.dispatchEvent(new MouseEvent(type, eventOptions))
          );

          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(intervalId);
          const message = `Timeout: "${label}" was not found within ${timeout} ms.`;
          console.error(`❌ ${message}`);
          reject(new Error(message));
        }
      }, 500);
    });
  }

  // ---------------------------------------------------------------------------
  // Core Battle Sequence
  // ---------------------------------------------------------------------------

  /**
   * Executes a single end-to-end battle cycle:
   *   1. Opens the Battle Period menu.
   *   2. Selects Rank Battle mode.
   *   3. Confirms entry into the match.
   *   4. Enables auto-battle once the PvP battle screen loads.
   *   5. Claims rewards and returns to the main menu after the battle ends.
   *
   * @returns {Promise<void>} Resolves when the full cycle is complete.
   */
  async function runBattleCycle() {
    // Step 1 — Open the Battle Period menu
    console.log('Step 1: Opening the Battle Period menu...');

    let timePeriodButton = findElementByTextAndSelector('時局', '.Home_gearText__IFwQK');

    if (!timePeriodButton) {
      // Fallback: locate the button via the coin image element
      const coinImage = document.querySelector('.Home_coinImg__Vw45C');
      if (coinImage) {
        timePeriodButton = coinImage.closest('.Home_silvercoin__i6k9V');
      }
    }

    if (!timePeriodButton) {
      console.error('❌ Battle Period button not found. Aborting cycle.');
      return;
    }

    timePeriodButton.click();
    console.log('✅ Battle Period menu opened.');
    await delay(1500);

    // Step 2 — Select Rank Battle mode
    console.log('Step 2: Selecting Rank Battle mode...');

    const rankBattleButton = findElementByTextAndSelector('排名戰', '.Home_gearText__IFwQK');

    if (!rankBattleButton) {
      console.error('❌ Rank Battle button not found. Aborting cycle.');
      return;
    }

    rankBattleButton.click();
    console.log('✅ Rank Battle mode selected.');

    // Step 3 — Confirm entry into the match
    console.log('Step 3: Confirming match entry...');

    try {
      await waitForElementAndClick(
        '.Teams_iconFightSensor__j96mT',
        30000,
        'Fight Confirmation Button'
      );
      console.log('✅ Match entry confirmed.');
    } catch {
      console.error('❌ Match entry confirmation failed. Aborting cycle.');
      return;
    }

    // Step 4 — Wait for the PvP battle screen and enable auto-battle
    console.log('Waiting for PvP battle screen...');

    await new Promise((resolve) => {
      const pollId = setInterval(async () => {
        if (!window.location.href.includes('pvpbattle')) return;

        clearInterval(pollId);
        console.log('🎯 PvP battle screen detected. Activating auto-battle in 5 s...');
        await delay(5000);

        const autoButton = document.querySelector('.BattleStage_iconAuto__9opfy');

        if (autoButton) {
          autoButton.style.opacity = '1';
          ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click'].forEach((type) =>
            autoButton.dispatchEvent(new Event(type, { bubbles: true, cancelable: true }))
          );
          autoButton.click();
          console.log('⚔️  Auto-battle activated.');
        } else {
          console.warn('⚠️  Auto-battle button not found; battle may proceed manually.');
        }

        resolve();
      }, 1000);
    });

    // Step 5 — Detect battle end, claim rewards, and return to main menu
    console.log('Waiting for battle results screen...');

    await new Promise((resolve) => {
      const pollId = setInterval(async () => {
        if (!window.location.href.includes('pvpresult/1v1')) return;

        clearInterval(pollId);
        console.log('🎉 Battle results screen detected.');

        // Claim post-battle rewards
        const rewardContainer = document.querySelector('.Bundle_rightBtnBox__H20C6');
        if (rewardContainer) {
          rewardContainer.click();
          console.log('🎁 Rewards claimed.');
        } else {
          console.warn('⚠️  Reward container not found; rewards may need manual collection.');
        }

        await delay(2500);

        // Navigate back to the main menu
        const returnButton = document.querySelector('.Navigator_itemBox_others__yyLXo');
        if (returnButton) {
          returnButton.click();
          console.log('🚪 Returned to main menu.');
        } else {
          console.error('❌ Return button not found; manual navigation required.');
        }

        resolve();
      }, 1000);
    });

    console.log('=== Battle cycle completed successfully ===');
  }

  // ---------------------------------------------------------------------------
  // Execution Entry Point
  // ---------------------------------------------------------------------------

  /**
   * Runs the battle cycle a specified number of times sequentially,
   * pausing 5 seconds between each cycle.
   *
   * @param {number} totalCycles - The number of battle cycles to execute.
   * @returns {Promise<void>}
   */
  async function runMultipleCycles(totalCycles) {
    for (let cycle = 1; cycle <= totalCycles; cycle++) {
      console.log(`\n--- Cycle ${cycle} / ${totalCycles} ---`);
      await runBattleCycle();

      if (cycle < totalCycles) {
        console.log('⏳ Pausing 5 seconds before next cycle...');
        await delay(5000);
      }
    }

    console.log('\n=== All cycles completed. Script terminated. ===');
  }

  /** Total number of battle cycles to execute. Modify as needed. */
  const TARGET_CYCLES = 5;

  runMultipleCycles(TARGET_CYCLES);
})();
