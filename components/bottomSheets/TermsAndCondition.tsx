import React from 'react'
import { ScrollView } from 'react-native'
import { Text } from '../theme/Themed'

const TermsAndCondition = () => {
    return (
        // <View style={{ display: "flex", flex:1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }} style={{ height: "100%", marginBottom: 20, overflow: "hidden" }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Terms & Conditions / End User License Agreement (EULA)</Text>

            <Text style={{ marginBottom: 10 }}>
                Welcome to Trendly. These Terms and Conditions ("Terms") constitute a legally binding agreement between you and iDiv Technologies ("we", "us", or "our"), the company behind Trendly.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>1. Acceptance of Terms</Text>
            <Text style={{ marginBottom: 10 }}>
                By using or registering on Trendly, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with these, do not use the app.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>2. User-Generated Content</Text>
            <Text style={{ marginBottom: 10 }}>
                Trendly may include user-generated content, including but not limited to profiles, posts, and collaborations. We do not tolerate any objectionable or abusive content.
                Users must not post or share any content that is offensive, discriminatory, unlawful, or harmful.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>3. Content Moderation and Reporting</Text>
            <Text style={{ marginBottom: 10 }}>
                Trendly includes moderation mechanisms to filter and report objectionable content. Trendly can:
                {'\n'}- Flag inappropriate or harmful content.
                {'\n'}- Block abusive users from contacting or viewing their profiles.
                {'\n'}We will review flagged content within 24 hours and remove any offending material or users who violate our policies.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>4. Advertising and Promotions</Text>
            <Text style={{ marginBottom: 10 }}>
                By registering with Trendly, you grant us the right to showcase and promote your public profile, including username and submitted content, on our landing pages, promotional material, and advertising campaigns. If you do not wish to be featured, you may deactivate or delete your profile from the app at any time.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>5. License</Text>
            <Text style={{ marginBottom: 10 }}>
                We grant you a limited, non-exclusive, non-transferable, revocable license to use the Trendly app for personal and non-commercial use only, subject to these Terms.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>6. Termination</Text>
            <Text style={{ marginBottom: 10 }}>
                We reserve the right to suspend or terminate your account and access to Trendly if you breach these Terms or engage in abusive or harmful behavior.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>7. Changes to Terms</Text>
            <Text style={{ marginBottom: 10 }}>
                We reserve the right to update these Terms at any time. Continued use of the app after changes indicates acceptance.
            </Text>

            <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>8. Contact Us</Text>
            <Text style={{ marginBottom: 20 }}>
                If you have any questions or concerns about these Terms or wish to report content, please contact us at support@trendly.pro.
            </Text>
        </ScrollView>
        // </View>
    )
}

export default TermsAndCondition