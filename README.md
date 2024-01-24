# Beam Salesforce Commerce Cloud (Demandware) Cartridge

Beam provides a cartridge to integrate with Salesforce Commerce Cloud (SFCC). This cartridge enables a SFCC storefront to use the Beam Impact widgets.

## Set Up

Cartridge structure:

-   `app_storefront_base` The Salesforce Reference Architecture base cartridge. Your app should have a copy of this already.
-   `app_storefront_overrides` Example cartridge for a customized storefront.
-   `plugin_beam` Contains template files for including in customized storefronts.
    Other:
-   `metadata` Includes XML files defining configuration variables for Beam.

### Download `plugin_beam` Cartridge

1. Navigate to the following [Github Repo](https://github.com/Beam-Impact/beam-b2c-sfra)
2. Download the **`plugin_beam`** folder and add it to your **`/cartridges`** folder
3. Update the **`uploadCartridge`** script in **`package.json`**:
    ```json
    "uploadCartridge": "... && sgmf-scripts --uploadCartridge plugin_beam",
    ```
4. Navigate to Administration → Sites → Manage Sites → RefArch - Settings
5. Under cartridges, add **`plugin_beam`** before the override cartridge
   ![RefArch - Settings](documentation/assets/beam_refArch_settings.png)

## Configure

### Metadata

Metadata files contain information about the structure, formatting, and characteristics of the associated data. The **`beam_configuration.xml`** holds credentials for the Beam widgets.

### Step 1: Downloading `beam_configuration.xml`

1. After downloading the **`plugin_beam`** cartridge source, navigate to the **`metadata`** > **`meta`** folder in the following [Github Repo](https://github.com/Beam-Impact/beam-b2c-sfra)
2. Download **`beam_configuration.xml`**

### Step 2: Uploading `beam_configuration.xml`

1. Go to Administration → Site Development → Import & Export
2. Click on the Upload button
3. Choose the file option and select **`beam_configuration.xml`**
4. Click Upload
5. Return to the Import & Export page
6. Select Import under Meta Data
7. Choose **`beam_configuration.xml`**
8. Click Next
9. Once the file is validated, select Import

### Step 3: Configuring Beam Credentials

1. Navigate to Merchant Tools → Site Preferences → Custom Preferences
2. Select Beam Credentials
3. Paste the credentials provided by Beam into the respective fields:
    - Store ID
    - Language
    - Chain ID
    - API Key
    - Base URL
    - Statsig API Key (optional)
    - Domain URL (optional)

## 3. Integration

### Beam Global Configuration

1. Open the htmlHead template file **`cartridge/templates/default/common/htmlHead.isml`**
2. To include this template, add the following line before the **`htmlHead`** hook:
    ```jsx
    <isinclude template="beam/beam_init" />
    ```

### Select Nonprofit Widget

1. Open the cart template file **`cartridge/templates/default/cart/cart.isml`**
2. To include this template, add the following line:

    ```jsx
    <isinclude template="beam/beam_select_nonprofit" />
    ```

### Post-Purchase Widget

1.  Open the confirmationDetails template file **cartridge/templates/default/checkout/confirmation/confirmationDetails.isml**
2.  To include this template, add the following line:

    ```jsx
    <isinclude template="beam/beam_post_purchase" />
    ```

### Community & Cumulative Impact Widget

### - Method 1: Page Designer

Page Designer allows Merchandising and Marketing teams to take charge of updates independently, eliminating the need for ongoing developer involvement. This autonomy not only minimizes overhead but also accelerates time-to-market for new online experiences, ensuring a high standard of quality. Page Designer in Salesforce B2C is typically used for designing and managing static pages. Hence the available widgets being the 'Community Impact' and 'Cumulative Impact' widgets.

#### How to Use Page Designer for Static Widgets:

1. **Navigate to Page Designer:**
    - Go to [Merchant Tools → Content → Page Designer]
2. **Select Your Page:**
    - Choose the static page where you want to add the widgets
3. **Select Components, Under Beam, Select A Widget:**
    - Look for the 'Beam' section and select 'Community Impact' or/and 'Cumulative Impact'
4. **Drag and Drop:**
    - Simply drag your selected widget onto the page
      </br>
      <img src="documentation/assets/beam_page_designer.png" width="450">
5. **Add a Textbox Component Above the Community Impact Widget That States:**

    ```jsx
    <h3>The [YOUR BRAND NAME HERE]'s Impact</h3>
    <p>
        1% of every [YOUR BRAND NAME HERE] purchase is donated to a nonprofit of
        your choice. Check out the impact the [YOUR BRAND NAME HERE] community is
        making below.
    </p>
    ```

### - Method 2: Content Assets

1. **How to find assets list: Merchant Tools →  Content →  Content**
2. **Find the page you’d like to add the widgets to**
3. **Click ‘Lock’ under the page header**
4. **Navigate to body and add the following:**

    ```jsx
    <script type="module" src="https://production-beam-widgets.beamimpact.com/web-sdk/v1.30.0/dist/components/community-impact.esm.js"></script>
    <script type="module" src="https://production-beam-widgets.beamimpact.com/web-sdk/v1.30.0/dist/components/cumulative-impact.esm.js"></script>

    <!-- Cumulative Impact Widget -->
    <beam-cumulative-impact
        apikey="API KEY"
        chainid="CHAIN ID"
        storeid="STORE ID"
        lang="en">
    </beam-cumulative-impact>

    <!-- Community Impact Widget -->
    <h3 style="text-align: center;font-family: inherit; font-weight: 500;">
        The [YOUR BRAND NAME HERE]'s Impact
    </h3>
    <p style="font-weight: 300;font-size: 16px;max-width: 640px; margin:5px auto 15px;text-align: center;">
        1% of every [YOUR BRAND NAME HERE] purchase is donated to a nonprofit of your choice.
        <br/> Check out the impact the [YOUR BRAND NAME HERE] community is making below.
    </p>
    <beam-community-impact
        apikey="API KEY"
        chainid="CHAIN ID"
        storeid="STORE ID"
        lang="en"
        >
    </beam-community-impact>
    ```

### - Method 3: Inline

1. **Access the template in the desired location for widget placement and include the following lines:**

    ```jsx
    <!-- Cumulative Impact Widget -->
    <isinclude template="beam/beam_cumulative_impact"/>

    <!-- Community Impact Widget -->
    <h3>The [YOUR BRAND NAME HERE]'s Impact</h3>
    <p>1% of every [YOUR BRAND NAME HERE] purchase is donated to a nonprofit of your choice.
    Check out the impact the [YOUR BRAND NAME HERE] community is making below.</p>

    <isinclude template="beam/beam_community_impact"/>
    ```
