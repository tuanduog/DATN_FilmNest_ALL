package type;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreatePaymentLinkRequestBody {

    String productName;

    String description;

    String returnUrl;

    Double price;

    String cancelUrl;
}